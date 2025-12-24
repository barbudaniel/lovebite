import { Resend } from 'resend';
import { NextResponse } from 'next/server';

const resend = new Resend(process.env.RESEND_API_KEY);

function getOnboardingEmailHtml(contractLink: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Invitation to Join Lovdash Fans</title>
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
        /* General Resets */
        body, table, td, a { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
        table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
        img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
        table { border-collapse: collapse !important; }
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: #fce7f3; color: #333333; }

        /* Client Specific Fixes */
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }

        /* Button Hover */
        .button:hover { background-color: #be185d !important; transition: background-color 0.3s ease; }

        /* Responsive Styles */
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .content-padding { padding-left: 24px !important; padding-right: 24px !important; padding-top: 30px !important; padding-bottom: 30px !important; }
            .mobile-header { padding-top: 30px !important; padding-bottom: 20px !important; }
            .mobile-font-size { font-size: 24px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: #fff1f2;">

    <!-- Preheader Text (Hidden) -->
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        You have been selected. Please sign your contract to complete your agency enrollment.
    </div>

    <!-- Main Table Container -->
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #fff1f2;">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                
                <!-- Email Content Wrapper -->
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 12px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
                    
                    <!-- Decorative Top Bar -->
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, #db2777 0%, #be185d 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>

                    <!-- Header with Logo -->
                    <tr>
                        <td align="center" class="mobile-header" style="padding: 40px 0 20px 0; background-color: #ffffff;">
                           
                        </td>
                    </tr>

                    <!-- Main Content Area -->
                    <tr>
                        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">

                            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: #1f2937; letter-spacing: -0.5px;">
                                Let's Make It Official
                            </h2>
                            
                            <p style="margin: 0 0 35px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: #4b5563;">
                                To secure your spot and unlock our agency resources, the final step is to review and sign your exclusive agency contract.
                            </p>

                            <!-- CTA Button -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td align="center">
                                        <!-- Button -->
                                        <div>
                                            <!--[if mso]>
                                            <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${contractLink}" style="height:54px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="#db2777">
                                            <w:anchorlock/>
                                            <center>
                                            <![endif]-->
                                            <a href="${contractLink}" class="button" style="background-color: #db2777; border-radius: 50px; color: #ffffff; display: inline-block; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 54px; text-align: center; text-decoration: none; width: 260px; -webkit-text-size-adjust: none; box-shadow: 0 4px 12px rgba(219, 39, 119, 0.2);">
                                                Sign Contract & Join
                                            </a>
                                            <!--[if mso]>
                                            </center>
                                            </v:roundrect>
                                            <![endif]-->
                                        </div>
                                    </td>
                                </tr>
                            </table>

                            <!-- Support Link -->
                            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px;">
                                <tr>
                                    <td align="center" style="border-top: 1px solid #f3f4f6; padding-top: 25px;">
                                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: #9ca3af;">
                                            Questions about the agreement?<br>
                                            <a href="mailto:onboarding@Lovdash.fans" style="color: #db2777; text-decoration: none; font-weight: 500;">Contact Onboarding Support</a>
                                        </p>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>

                    <!-- Footer Section -->
                    <tr>
                        <td style="background-color: #111827; padding: 40px 30px; text-align: center;">
                            
                            <p style="margin: 0 0 25px 0;">
                                <a href="https://Lovdash.fans" style="color: #9ca3af; text-decoration: none; font-size: 13px;">www.Lovdash.fans</a>
                            </p>
                            
                            <!-- Divider -->
                            <div style="height: 1px; background-color: #374151; width: 100%; max-width: 200px; margin: 0 auto 25px auto;"></div>

                            <!-- Legal Text -->
                            <p style="margin: 0; color: #6b7280; font-size: 11px; line-height: 1.6; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;">
                                &copy; 2025 TRUST CHARGE SOLUTIONS LTD.<br>
                                A private limited company incorporated in England and Wales.<br>
                                Registered Office: 20 Wenlock Road, London, England, N1 7GU.
                            </p>
                        </td>
                    </tr>

                </table>
                <!-- End Email Content Wrapper -->

                <!-- Bottom Spacer -->
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
    const { to, contractLink } = await request.json();

    if (!to) {
      return NextResponse.json(
        { error: 'Recipient email (to) is required' },
        { status: 400 }
      );
    }

    if (!contractLink) {
      return NextResponse.json(
        { error: 'Contract link is required' },
        { status: 400 }
      );
    }

    const htmlContent = getOnboardingEmailHtml(contractLink);

    const { data, error } = await resend.emails.send({
      from: 'Lovdash Fans <onboarding@Lovdash.fans>',
      to: to,
      subject: 'Sign Your Contract – Complete Your Lovdash Agency Enrollment',
      html: htmlContent,
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
      message: 'Onboarding email sent successfully' 
    });

  } catch (error) {
    console.error('Failed to send email:', error);
    return NextResponse.json(
      { error: 'Failed to send email' },
      { status: 500 }
    );
  }
}
