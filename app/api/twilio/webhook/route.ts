import { NextRequest, NextResponse } from "next/server";
import { parseIncomingMessage, validateTwilioSignature } from "@/lib/twilio";
import { createClient } from "@/lib/supabase-server";

/**
 * POST /api/twilio/webhook
 * 
 * Webhook endpoint for receiving incoming WhatsApp messages from Twilio
 * 
 * Configure this URL in your Twilio console:
 * https://yourdomain.com/api/twilio/webhook
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const params = Object.fromEntries(new URLSearchParams(body));
    
    // Validate Twilio signature for security
    const signature = request.headers.get('x-twilio-signature') || '';
    const url = request.url;
    
    if (!validateTwilioSignature(signature, url, params)) {
      console.error('Invalid Twilio signature');
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 403 }
      );
    }
    
    // Parse the incoming message
    const message = parseIncomingMessage(params);
    
    console.log('Incoming WhatsApp message:', {
      from: message.from,
      message: message.message,
      hasMedia: !!message.mediaUrls,
    });
    
    // Store message in database
    const supabase = await createClient();
    await supabase.from('whatsapp_messages').insert({
      from_number: message.from,
      to_number: message.to,
      message_body: message.message,
      media_urls: message.mediaUrls,
      message_sid: message.messageSid,
      direction: 'inbound',
      status: 'received',
      received_at: new Date().toISOString(),
    });
    
    // Process the message (handle commands, etc.)
    await processIncomingMessage(message);
    
    // Return TwiML response (optional)
    return new NextResponse(
      '<?xml version="1.0" encoding="UTF-8"?><Response></Response>',
      {
        headers: {
          'Content-Type': 'text/xml',
        },
      }
    );
  } catch (error: any) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: error.message || 'Webhook processing failed' },
      { status: 500 }
    );
  }
}

/**
 * Process incoming message and execute commands
 */
async function processIncomingMessage(message: {
  from: string;
  to: string;
  message: string;
  mediaUrls?: string[];
  messageSid: string;
}) {
  const supabase = await createClient();
  
  // Check if message is a command (starts with /)
  if (message.message.startsWith('/')) {
    const command = message.message.split(' ')[0].toLowerCase();
    
    // Handle different commands
    switch (command) {
      case '/help':
        // Send help message
        // This would be handled by sending a response via Twilio
        console.log('Help command received from:', message.from);
        break;
        
      case '/stats':
        // Send statistics
        console.log('Stats command received from:', message.from);
        break;
        
      case '/bio':
        // Send bio link
        console.log('Bio command received from:', message.from);
        break;
        
      default:
        console.log('Unknown command:', command);
    }
  }
  
  // Handle media uploads
  if (message.mediaUrls && message.mediaUrls.length > 0) {
    console.log('Media received:', message.mediaUrls);
    
    // Find the creator by phone number
    const { data: creator } = await supabase
      .from('creators')
      .select('id, username')
      .eq('phone_number', message.from)
      .single();
    
    if (creator) {
      console.log('Media from creator:', creator.username);
      // Process media upload (download from Twilio and upload to storage)
      // This would integrate with your existing media processing pipeline
    }
  }
}

/**
 * GET /api/twilio/webhook
 * 
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    success: true,
    message: 'Twilio webhook endpoint is active',
    timestamp: new Date().toISOString(),
  });
}

