// ============================================
// EMAIL TEMPLATES - Lovdash Design System
// ============================================

const BRAND_COLOR = "#db2777"; // pink-600
const BRAND_COLOR_DARK = "#be185d"; // pink-700
const BACKGROUND_COLOR = "#fff1f2"; // rose-50
const DARK_BG = "#111827"; // gray-900
const TEXT_PRIMARY = "#1f2937"; // gray-800
const TEXT_SECONDARY = "#4b5563"; // gray-600
const TEXT_MUTED = "#9ca3af"; // gray-400

// Base email wrapper with consistent styling
function emailWrapper(content: string, preheaderText: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Lovdash</title>
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
        body { height: 100% !important; margin: 0 !important; padding: 0 !important; width: 100% !important; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background-color: ${BACKGROUND_COLOR}; color: #333333; }
        a[x-apple-data-detectors] { color: inherit !important; text-decoration: none !important; font-size: inherit !important; font-family: inherit !important; font-weight: inherit !important; line-height: inherit !important; }
        .button:hover { background-color: ${BRAND_COLOR_DARK} !important; }
        @media screen and (max-width: 600px) {
            .email-container { width: 100% !important; max-width: 100% !important; }
            .content-padding { padding-left: 24px !important; padding-right: 24px !important; padding-top: 30px !important; padding-bottom: 30px !important; }
            .mobile-header { padding-top: 30px !important; padding-bottom: 20px !important; }
            .mobile-font-size { font-size: 24px !important; }
            .code-box { font-size: 28px !important; letter-spacing: 6px !important; }
        }
    </style>
</head>
<body style="margin: 0; padding: 0; background-color: ${BACKGROUND_COLOR};">
    <div style="display: none; font-size: 1px; line-height: 1px; max-height: 0px; max-width: 0px; opacity: 0; overflow: hidden; mso-hide: all; font-family: sans-serif;">
        ${preheaderText}
    </div>
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: ${BACKGROUND_COLOR};">
        <tr>
            <td align="center" style="padding: 40px 10px;">
                <table border="0" cellpadding="0" cellspacing="0" width="600" class="email-container" style="background-color: #ffffff; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08);">
                    <tr>
                        <td height="6" style="background: linear-gradient(90deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_DARK} 100%); font-size: 0; line-height: 0;">&nbsp;</td>
                    </tr>
                    <tr>
                        <td align="center" class="mobile-header" style="padding: 40px 0 10px 0; background-color: #ffffff;">
                            <table border="0" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td style="padding-right: 12px;">
                                        <div style="width: 42px; height: 42px; background: linear-gradient(135deg, ${BRAND_COLOR} 0%, ${BRAND_COLOR_DARK} 100%); border-radius: 10px; display: flex; align-items: center; justify-content: center;">
                                            <span style="color: white; font-size: 20px; font-weight: bold;">L</span>
                                        </div>
                                    </td>
                                    <td>
                                        <span style="font-size: 24px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">Lovdash</span>
                                    </td>
                                </tr>
                            </table>
                        </td>
                    </tr>
                    ${content}
                    <tr>
                        <td style="background-color: ${DARK_BG}; padding: 40px 30px; text-align: center;">
                            <p style="margin: 0 0 25px 0;">
                                <a href="https://lovdash.com" style="color: ${TEXT_MUTED}; text-decoration: none; font-size: 13px;">www.lovdash.com</a>
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

// Verification code display box
function codeBox(code: string): string {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
        <tr>
            <td align="center">
                <div class="code-box" style="background: linear-gradient(135deg, #fdf2f8 0%, #fce7f3 100%); border: 2px dashed ${BRAND_COLOR}; border-radius: 12px; padding: 20px 40px; display: inline-block;">
                    <span style="font-family: 'Courier New', monospace; font-size: 36px; font-weight: bold; color: ${BRAND_COLOR}; letter-spacing: 8px;">${code}</span>
                </div>
            </td>
        </tr>
    </table>
  `;
}

// Primary CTA button
function ctaButton(text: string, href: string): string {
  return `
    <table border="0" cellpadding="0" cellspacing="0" width="100%">
        <tr>
            <td align="center">
                <div>
                    <!--[if mso]>
                    <v:roundrect xmlns:v="urn:schemas-microsoft-com:vml" xmlns:w="urn:schemas-microsoft-com:office:word" href="${href}" style="height:54px;v-text-anchor:middle;width:260px;" arcsize="50%" stroke="f" fillcolor="${BRAND_COLOR}">
                    <w:anchorlock/>
                    <center>
                    <![endif]-->
                    <a href="${href}" class="button" style="background-color: ${BRAND_COLOR}; border-radius: 50px; color: #ffffff; display: inline-block; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; font-weight: bold; line-height: 54px; text-align: center; text-decoration: none; width: 260px; -webkit-text-size-adjust: none; box-shadow: 0 4px 12px rgba(219, 39, 119, 0.3);">
                        ${text}
                    </a>
                    <!--[if mso]>
                    </center>
                    </v:roundrect>
                    <![endif]-->
                </div>
            </td>
        </tr>
    </table>
  `;
}

// ============================================
// EMAIL VERIFICATION
// ============================================
export function getEmailVerificationHtml(code: string, name?: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Verify Your Email
            </h2>
            
            <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                ${name ? `Hi ${name},` : 'Hi there,'} welcome to Lovdash!
            </p>
            
            <p style="margin: 0 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Use the code below to verify your email address:
            </p>

            ${codeBox(code)}

            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED};">
                This code expires in <strong>15 minutes</strong>.<br>
                If you didn't create an account, you can safely ignore this email.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Need help?<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">Contact Support</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Your verification code is ${code}. Enter this code to verify your email address.`);
}

// ============================================
// PASSWORD RESET
// ============================================
export function getPasswordResetHtml(code: string, resetLink: string, name?: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #fef3c7 0%, #fde68a 100%); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">🔐</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Reset Your Password
            </h2>
            
            <p style="margin: 0 0 10px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                ${name ? `Hi ${name},` : 'Hi,'} we received a request to reset your password.
            </p>
            
            <p style="margin: 0 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Enter this code to reset your password:
            </p>

            ${codeBox(code)}

            ${ctaButton('Reset Password', resetLink)}

            <p style="margin: 25px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED};">
                This code expires in <strong>30 minutes</strong>.<br>
                If you didn't request this, you can safely ignore this email.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #d97706; background-color: #fffbeb; padding: 12px 20px; border-radius: 8px; display: inline-block;">
                            ⚠️ Never share this code with anyone. Lovdash will never ask for it.
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Your password reset code is ${code}. Click to reset your password.`);
}

// ============================================
// WELCOME EMAIL (after verification)
// ============================================
export function getWelcomeHtml(name: string, dashboardUrl: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%); border-radius: 50%; margin: 0 auto 25px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🎉</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Welcome to Lovdash!
            </h2>
            
            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Hi ${name}, your email has been verified and your account is ready!<br>
                We're thrilled to have you join our creator community.
            </p>

            ${ctaButton('Go to Dashboard', dashboardUrl)}

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 40px;">
                <tr>
                    <td style="text-align: left; background-color: #f9fafb; border-radius: 12px; padding: 25px;">
                        <h3 style="margin: 0 0 15px 0; font-size: 16px; font-weight: 600; color: ${TEXT_PRIMARY};">
                            Quick Start Guide:
                        </h3>
                        <table border="0" cellpadding="0" cellspacing="0" width="100%">
                            <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: ${TEXT_SECONDARY};">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: ${BRAND_COLOR}; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: bold;">1</span>
                                    Complete your profile setup
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: ${TEXT_SECONDARY};">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: ${BRAND_COLOR}; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: bold;">2</span>
                                    Create your bio link page
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: ${TEXT_SECONDARY};">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: ${BRAND_COLOR}; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: bold;">3</span>
                                    Upload your media content
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-size: 14px; color: ${TEXT_SECONDARY};">
                                    <span style="display: inline-block; width: 24px; height: 24px; background: ${BRAND_COLOR}; color: white; border-radius: 50%; text-align: center; line-height: 24px; margin-right: 10px; font-size: 12px; font-weight: bold;">4</span>
                                    Share and start earning!
                                </td>
                            </tr>
                        </table>
                    </td>
                </tr>
            </table>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Questions? We're here to help!<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">support@lovdash.com</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Welcome to Lovdash, ${name}! Your account is ready. Let's get started.`);
}

// ============================================
// ACCOUNT CREATED (with temporary password)
// ============================================
export function getAccountCreatedHtml(name: string, email: string, tempPassword: string, dashboardUrl: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ddd6fe 0%, #a78bfa 100%); border-radius: 50%; margin: 0 auto 25px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">✨</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Your Account is Ready!
            </h2>
            
            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Hi ${name}, your Lovdash account has been created.<br>
                Use the credentials below to sign in.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin: 30px 0;">
                <tr>
                    <td>
                        <div style="background: linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%); border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; text-align: left;">
                            <table border="0" cellpadding="0" cellspacing="0" width="100%">
                                <tr>
                                    <td style="padding: 10px 0; border-bottom: 1px solid #e2e8f0;">
                                        <span style="font-size: 12px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 0.5px;">Email</span><br>
                                        <span style="font-size: 16px; color: ${TEXT_PRIMARY}; font-weight: 500;">${email}</span>
                                    </td>
                                </tr>
                                <tr>
                                    <td style="padding: 15px 0 5px 0;">
                                        <span style="font-size: 12px; color: ${TEXT_MUTED}; text-transform: uppercase; letter-spacing: 0.5px;">Temporary Password</span><br>
                                        <span style="font-family: 'Courier New', monospace; font-size: 18px; color: ${BRAND_COLOR}; font-weight: bold; letter-spacing: 1px;">${tempPassword}</span>
                                    </td>
                                </tr>
                            </table>
                        </div>
                    </td>
                </tr>
            </table>

            ${ctaButton('Sign In Now', dashboardUrl)}

            <p style="margin: 25px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 13px; line-height: 1.5; color: #d97706; background-color: #fffbeb; padding: 12px 20px; border-radius: 8px; display: inline-block;">
                🔒 Please change your password after your first login for security.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 25px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Need help?<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">Contact Support</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Your Lovdash account is ready! Sign in with your temporary password.`);
}

// ============================================
// PASSWORD CHANGED CONFIRMATION
// ============================================
export function getPasswordChangedHtml(name: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #dcfce7 0%, #86efac 100%); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">✅</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Password Changed
            </h2>
            
            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Hi ${name}, your password has been successfully changed.<br>
                You can now use your new password to sign in.
            </p>

            <p style="margin: 0 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: #dc2626; background-color: #fef2f2; padding: 15px 20px; border-radius: 8px; display: inline-block;">
                ⚠️ If you didn't make this change, please <a href="mailto:security@lovdash.com" style="color: #dc2626; font-weight: bold;">contact us immediately</a>.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 35px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Need help?<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">Contact Support</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Your Lovdash password has been successfully changed.`);
}

// ============================================
// PHONE/WHATSAPP VERIFICATION
// ============================================
export function getPhoneVerificationHtml(code: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 60px; height: 60px; background: linear-gradient(135deg, #dcfce7 0%, #22c55e 100%); border-radius: 50%; margin: 0 auto 20px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 28px;">📱</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                Your Login Code
            </h2>
            
            <p style="margin: 0 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                Use this code to sign in to your Lovdash account:
            </p>

            ${codeBox(code)}

            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED};">
                This code expires in <strong>10 minutes</strong>.<br>
                If you didn't request this code, you can safely ignore it.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Need help?<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">Contact Support</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `Your Lovdash login code is ${code}.`);
}

// ============================================
// STUDIO/BUSINESS INVITATION
// ============================================
export function getStudioInviteHtml(studioName: string, inviterName: string, acceptLink: string): string {
  const content = `
    <tr>
        <td class="content-padding" style="padding: 20px 60px 50px 60px; text-align: center;">
            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #dbeafe 0%, #3b82f6 100%); border-radius: 50%; margin: 0 auto 25px auto; display: flex; align-items: center; justify-content: center;">
                <span style="font-size: 40px;">🤝</span>
            </div>
            
            <h2 class="mobile-font-size" style="margin: 0 0 20px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 28px; font-weight: 700; color: ${TEXT_PRIMARY}; letter-spacing: -0.5px;">
                You've Been Invited!
            </h2>
            
            <p style="margin: 0 0 30px 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 16px; line-height: 1.7; color: ${TEXT_SECONDARY};">
                <strong>${inviterName}</strong> has invited you to join<br>
                <span style="color: ${BRAND_COLOR}; font-weight: 600; font-size: 18px;">${studioName}</span>
            </p>

            ${ctaButton('View Invitation', acceptLink)}

            <p style="margin: 25px 0 0 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.6; color: ${TEXT_MUTED};">
                You can accept or decline this invitation from your dashboard.
            </p>

            <table border="0" cellpadding="0" cellspacing="0" width="100%" style="margin-top: 30px; border-top: 1px solid #f3f4f6; padding-top: 25px;">
                <tr>
                    <td align="center">
                        <p style="margin: 0; font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; font-size: 14px; line-height: 1.5; color: ${TEXT_MUTED};">
                            Questions about this invitation?<br>
                            <a href="mailto:support@lovdash.com" style="color: ${BRAND_COLOR}; text-decoration: none; font-weight: 500;">Contact Support</a>
                        </p>
                    </td>
                </tr>
            </table>
        </td>
    </tr>
  `;

  return emailWrapper(content, `${inviterName} has invited you to join ${studioName} on Lovdash.`);
}

