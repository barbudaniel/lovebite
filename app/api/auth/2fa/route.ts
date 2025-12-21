import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "crypto";

// Initialize Supabase admin client
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// Base32 encoding for TOTP secrets
const BASE32_CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ234567";

function generateBase32Secret(length = 32): string {
  const bytes = crypto.randomBytes(length);
  let result = "";
  for (const byte of bytes) {
    result += BASE32_CHARS[byte % 32];
  }
  return result;
}

function base32Decode(encoded: string): Buffer {
  const cleanEncoded = encoded.toUpperCase().replace(/\s/g, "");
  let bits = "";
  for (const char of cleanEncoded) {
    const val = BASE32_CHARS.indexOf(char);
    if (val === -1) continue;
    bits += val.toString(2).padStart(5, "0");
  }
  const bytes = new Uint8Array(Math.floor(bits.length / 8));
  for (let i = 0; i < bytes.length; i++) {
    bytes[i] = parseInt(bits.slice(i * 8, (i + 1) * 8), 2);
  }
  return Buffer.from(bytes);
}

function generateTOTP(secret: string, timestamp?: number): string {
  const counter = Math.floor((timestamp || Date.now()) / 30000);
  const counterBuffer = Buffer.alloc(8);
  counterBuffer.writeBigUInt64BE(BigInt(counter), 0);

  const secretBuffer = base32Decode(secret);
  const hmac = crypto.createHmac("sha1", secretBuffer);
  hmac.update(counterBuffer);
  const hash = hmac.digest();

  const offset = hash[hash.length - 1] & 0x0f;
  const code =
    ((hash[offset] & 0x7f) << 24) |
    ((hash[offset + 1] & 0xff) << 16) |
    ((hash[offset + 2] & 0xff) << 8) |
    (hash[offset + 3] & 0xff);

  return (code % 1000000).toString().padStart(6, "0");
}

function verifyTOTP(secret: string, code: string, window = 1): boolean {
  const now = Date.now();
  
  // Check current time slot and adjacent slots (window)
  for (let i = -window; i <= window; i++) {
    const timestamp = now + i * 30000;
    const expectedCode = generateTOTP(secret, timestamp);
    if (expectedCode === code) {
      return true;
    }
  }
  return false;
}

// ============================================
// GENERATE NEW 2FA SECRET
// ============================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, accountId, code } = body;

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 });
    }

    // Fetch account
    const { data: account, error: fetchError } = await supabase
      .from("creator_social_accounts")
      .select("*")
      .eq("id", accountId)
      .single();

    if (fetchError || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (action === "generate") {
      // Generate new secret
      const secret = generateBase32Secret(20);
      
      // Generate provisioning URI for QR code
      const platform = account.platform || "Lovebite";
      const username = account.username || account.email || "account";
      const uri = `otpauth://totp/${encodeURIComponent(platform)}:${encodeURIComponent(username)}?secret=${secret}&issuer=${encodeURIComponent("Lovebite")}&digits=6&period=30`;

      // Store secret temporarily (not enabled yet until verified)
      await supabase
        .from("creator_social_accounts")
        .update({ two_factor_secret: secret })
        .eq("id", accountId);

      return NextResponse.json({
        success: true,
        secret,
        uri,
        message: "Scan the QR code with your authenticator app and verify with a code",
      });
    }

    if (action === "verify") {
      if (!code) {
        return NextResponse.json({ error: "Verification code required" }, { status: 400 });
      }

      const secret = account.two_factor_secret;
      if (!secret) {
        return NextResponse.json({ error: "No 2FA secret found. Generate one first." }, { status: 400 });
      }

      const isValid = verifyTOTP(secret, code);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid code. Please try again." }, { status: 400 });
      }

      // Enable 2FA
      await supabase
        .from("creator_social_accounts")
        .update({ two_factor_enabled: true })
        .eq("id", accountId);

      return NextResponse.json({
        success: true,
        message: "2FA enabled successfully",
      });
    }

    if (action === "disable") {
      // Disable 2FA
      await supabase
        .from("creator_social_accounts")
        .update({ 
          two_factor_enabled: false,
          two_factor_secret: null,
        })
        .eq("id", accountId);

      return NextResponse.json({
        success: true,
        message: "2FA disabled",
      });
    }

    if (action === "get-code") {
      // Get current TOTP code (for accounts where we store the secret)
      const secret = account.two_factor_secret;
      if (!secret) {
        return NextResponse.json({ error: "No 2FA secret configured" }, { status: 400 });
      }

      const totpCode = generateTOTP(secret);
      const timeRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);

      return NextResponse.json({
        success: true,
        code: totpCode,
        timeRemaining,
        expiresAt: Date.now() + timeRemaining * 1000,
      });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });

  } catch (error) {
    console.error("2FA API error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}

// ============================================
// GET CURRENT TOTP CODE
// ============================================

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");

    if (!accountId) {
      return NextResponse.json({ error: "Account ID required" }, { status: 400 });
    }

    const { data: account, error } = await supabase
      .from("creator_social_accounts")
      .select("two_factor_secret, two_factor_enabled")
      .eq("id", accountId)
      .single();

    if (error || !account) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    if (!account.two_factor_secret) {
      return NextResponse.json({ error: "No 2FA secret configured" }, { status: 400 });
    }

    const code = generateTOTP(account.two_factor_secret);
    const timeRemaining = 30 - (Math.floor(Date.now() / 1000) % 30);

    return NextResponse.json({
      success: true,
      code,
      timeRemaining,
      enabled: account.two_factor_enabled,
    });

  } catch (error) {
    console.error("2FA GET error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}



