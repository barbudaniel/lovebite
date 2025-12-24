import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

function getSuccessEmailHtml(creatorName: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Welcome to Lovdash Fans</title>
    <!--[if mso]>
    <noscript>
    <xml>
    <o:OfficeDocumentSettings>
    <o:PixelsPerInch>96</o:PixelsPerInch>
    </o:OfficeDocumentSettings>
    </xml>
    </noscript>
    <![endif]-->
    <style>
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fce7f3; color: #333333; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .content-padding { padding-left: 24px !important; padding-right: 24px !important; padding-top: 30px !important; padding-bottom: 30px !important; }
            .mobile-header { padding-top: 30px !important; padding-bottom: 20px !important; }
            .mobile-font-size { font-size: 24px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff1f2;">

    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        Welcome to Lovdash Fans! Your contract is attached.
    </div>

    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1f2;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #10b981 0%, #059669 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <tr>
                        <td align="center" class="mobile-header" style="padding: 40px 0 20px 0; background-color: #ffffff;">
                            <h1 style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 26px; font-weight: 800; letter-spacing: -0.5px; color: #111827;">
                                <a href="https://Lovdash.fans" target="_blank" style="color: #111827; text-decoration: none;">Lovdash<span style="color: #db2777;">FANS</span></a>
                            </h1>
                        </td>
                    </tr>

                    <tr>
                        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">

                            <!-- Success Icon -->
                            <div style="margin: 0 0 25px 0;">
                                <div style="width: 70px; height: 70px; background-color: #d1fae5; border-radius: 50%; display: inline-block; line-height: 70px;">
                                    <span style="font-size: 32px;">✓</span>
                                </div>
                            </div>

                            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
                                Welcome to the Family, ${creatorName}!
                            </h2>
                            
                            <p style="margin: 0 0 25px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #4b5563;">
                                Congratulations! Your onboarding is complete and you're now officially part of Lovdash Fans. We're thrilled to have you on board.
                            </p>

                            <p style="margin: 0 0 35px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #4b5563;">
                                Your signed contract is attached to this email for your records. Please keep it in a safe place.
                            </p>

                            <!-- What's Next Section -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #f9fafb; border-radius: 8px; margin-bottom: 25px;">
                                <tr>
                                    <td style="padding: 25px;">
                                        <h3 style="margin: 0 0 15px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: 600; color: #1f2937; text-align: left;">
                                            What happens next?
                                        </h3>
                                        <ul style="margin: 0; padding: 0 0 0 20px; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.8; color: #4b5563; text-align: left;">
                                            <li>Our team will reach out within 24-48 hours</li>
                                            <li>You'll receive access to your creator dashboard</li>
                                            <li>We'll schedule your onboarding call</li>
                                        </ul>
                                    </td>
                                </tr>
                            </table>

                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px;">
                                <tr>
                                    <td align="center" style="border-top: 1px solid #f3f4f6; padding-top: 25px;">
                                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #9ca3af;">
                                            Questions? We're here to help.<br>
                                            <a href="mailto:support@Lovdash.fans" style="color: #db2777; text-decoration: none; font-weight: 500;">Contact Support</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <tr>
                        <td style="background-color: #111827; padding: 40px 30px; text-align: center;">
                            <p style="margin: 0 0 15px 0; color: #ffffff; font-size: 14px; font-weight: 700; letter-spacing: 1px;">Lovdash FANS</p>
                            <p style="margin: 0 0 25px 0;">
                                <a href="https://Lovdash.fans" style="color: #9ca3af; text-decoration: none; font-size: 13px;">www.Lovdash.fans</a>
                            </p>
                            <div style="height: 1px; background-color: #374151; width: 100%; max-width: 200px; margin: 0 auto 25px auto;"></div>
                            <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                &copy; 2025 TRUST CHARGE SOLUTIONS LTD.<br>
                                A private limited company incorporated in England and Wales.<br>
                                Registered Office: 20 Wenlock Road, London, England, N1 7GU.
                            </p>
                        </td>
                    </tr>

                </table>

                <table border="0" cellpadding="0" cellspacing="0" width="100%">
                    <tr>
                        <td height="40" style="font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>
                </table>

            </td>
        </tr>
    </table>

</body>
</html>`;
}

export async function POST(request: Request) {
  try {
    const { to, creatorName, contractPdfUrl, contractHtml } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email (to) is required' },
        { status: 400 }
      );
    }

    if (!creatorName) {
      return NextResponse.json(
        { error: 'Creator name is required' },
        { status: 400 }
      );
    }

    if (!contractPdfUrl && !contractHtml) {
      return NextResponse.json(
        { error: 'Either contractPdfUrl or contractHtml is required' },
        { status: 400 }
      );
    }

    const htmlContent = getSuccessEmailHtml(creatorName);

    // Build attachments based on what's provided
    const attachments = [];
    
    if (contractPdfUrl) {
      // Attach PDF from URL (Resend will fetch it)
      attachments.push({
        filename: 'Lovdash_Agency_Contract.pdf',
        path: contractPdfUrl,
      });
    } else if (contractHtml) {
      // Attach HTML as file
      attachments.push({
        filename: 'Lovdash_Agency_Contract.html',
        content: Buffer.from(contractHtml, 'utf-8'),
        contentType: 'text/html',
      });
    }

    const { data, error } = await resend.emails.send({
      from: 'Lovdash Fans <onboarding@Lovdash.fans>',
      to: to,
      subject: 'Welcome to Lovdash Fans – Your Signed Contract',
      html: htmlContent,
      attachments,
    });

    if (error) {
      console.error('Resend error:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ 
      success: true, 
      id: data?.id,
      message: 'Contract success email sent' 
    });

  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
