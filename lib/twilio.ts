/**
 * Twilio WhatsApp Integration Service
 * 
 * This service handles all Twilio API interactions for WhatsApp messaging
 * 
 * Required environment variables:
 * - TWILIO_ACCOUNT_SID
 * - TWILIO_AUTH_TOKEN
 * - TWILIO_PHONE_NUMBER
 */

const TWILIO_ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const TWILIO_AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const TWILIO_PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
const TWILIO_WHATSAPP_NUMBER = `whatsapp:${TWILIO_PHONE_NUMBER}`;

// Twilio API Base URL
const TWILIO_API_BASE = 'https://api.twilio.com/2010-04-01';

/**
 * Send a WhatsApp message via Twilio
 */
export async function sendWhatsAppMessage(
  to: string, // Phone number in E.164 format (e.g., +40712345678)
  message: string,
  mediaUrl?: string
): Promise<{ success: boolean; messageId?: string; error?: string }> {
  try {
    // Ensure phone number has whatsapp: prefix
    const toNumber = to.startsWith('whatsapp:') ? to : `whatsapp:${to}`;
    
    // Prepare request body
    const body = new URLSearchParams({
      From: TWILIO_WHATSAPP_NUMBER,
      To: toNumber,
      Body: message,
    });
    
    if (mediaUrl) {
      body.append('MediaUrl', mediaUrl);
    }
    
    // Make API request
    const response = await fetch(
      `${TWILIO_API_BASE}/Accounts/${TWILIO_ACCOUNT_SID}/Messages.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        },
        body: body.toString(),
      }
    );
    
    const data = await response.json();
    
    if (!response.ok) {
      return {
        success: false,
        error: data.message || `HTTP ${response.status}`,
      };
    }
    
    return {
      success: true,
      messageId: data.sid,
    };
  } catch (error: any) {
    console.error('Twilio send message error:', error);
    return {
      success: false,
      error: error.message || 'Failed to send message',
    };
  }
}

/**
 * Send a verification code via WhatsApp
 */
export async function sendVerificationCode(
  phoneNumber: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit code
    
    const message = `Your Lovdash verification code is: ${code}\n\nThis code will expire in 10 minutes. Do not share this code with anyone.`;
    
    const result = await sendWhatsAppMessage(phoneNumber, message);
    
    if (!result.success) {
      return { success: false, error: result.error };
    }
    
    // In a production environment, you would store the code in a database with an expiry
    // For now, we'll return success and let the frontend handle verification
    
    return { success: true };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to send verification code',
    };
  }
}

/**
 * Get message status from Twilio
 */
export async function getMessageStatus(
  messageSid: string
): Promise<{
  success: boolean;
  status?: 'queued' | 'sent' | 'delivered' | 'read' | 'failed' | 'undelivered';
  error?: string;
}> {
  try {
    const response = await fetch(
      `${TWILIO_API_BASE}/Accounts/${TWILIO_ACCOUNT_SID}/Messages/${messageSid}.json`,
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${TWILIO_ACCOUNT_SID}:${TWILIO_AUTH_TOKEN}`).toString('base64')}`,
        },
      }
    );
    
    if (!response.ok) {
      const data = await response.json();
      return {
        success: false,
        error: data.message || `HTTP ${response.status}`,
      };
    }
    
    const data = await response.json();
    
    return {
      success: true,
      status: data.status,
    };
  } catch (error: any) {
    return {
      success: false,
      error: error.message || 'Failed to get message status',
    };
  }
}

/**
 * Process incoming WhatsApp webhook from Twilio
 * 
 * This should be called from the webhook endpoint
 */
export function parseIncomingMessage(body: any): {
  from: string; // Phone number without whatsapp: prefix
  to: string;
  message: string;
  mediaUrls?: string[];
  messageSid: string;
} {
  return {
    from: body.From?.replace('whatsapp:', '') || '',
    to: body.To?.replace('whatsapp:', '') || '',
    message: body.Body || '',
    mediaUrls: body.NumMedia > 0 
      ? Array.from({ length: parseInt(body.NumMedia) }, (_, i) => body[`MediaUrl${i}`])
      : undefined,
    messageSid: body.MessageSid || '',
  };
}

/**
 * Validate Twilio webhook signature
 */
export function validateTwilioSignature(
  signature: string,
  url: string,
  params: Record<string, any>
): boolean {
  try {
    const crypto = require('crypto');
    
    // Sort parameters
    const sortedParams = Object.keys(params)
      .sort()
      .map(key => `${key}${params[key]}`)
      .join('');
    
    const data = url + sortedParams;
    
    const hmac = crypto
      .createHmac('sha1', TWILIO_AUTH_TOKEN)
      .update(Buffer.from(data, 'utf-8'))
      .digest('base64');
    
    return hmac === signature;
  } catch (error) {
    console.error('Twilio signature validation error:', error);
    return false;
  }
}

/**
 * Format a phone number to E.164 format
 */
export function formatPhoneNumber(phoneNumber: string): string {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');
  
  // If it doesn't start with +, add it
  if (!cleaned.startsWith('+')) {
    cleaned = '+' + cleaned;
  }
  
  return cleaned;
}

/**
 * Validate phone number format (E.164)
 */
export function isValidPhoneNumber(phoneNumber: string): boolean {
  // E.164 format: +[country code][number]
  // Length: 8-15 digits (including country code)
  const e164Regex = /^\+[1-9]\d{1,14}$/;
  return e164Regex.test(phoneNumber);
}

/**
 * Get Twilio configuration
 */
export function getTwilioConfig() {
  return {
    accountSid: TWILIO_ACCOUNT_SID,
    phoneNumber: TWILIO_PHONE_NUMBER,
    whatsappNumber: TWILIO_WHATSAPP_NUMBER,
  };
}

