import { Resend } from 'resend';
import { env } from '../lib/env';

// Resend client instance
export const resend = env.resendApiKey ? new Resend(env.resendApiKey) : null;

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  text: string;
  headers?: Record<string, string>;
}

/**
 * Normalizes and determines the sender address.
 * Priority:
 * 1. env.resendFromEmail (e.g. "ClientPilot AI <auth@verified-domain.com>" or "auth@verified-domain.com")
 * 2. env.outreachFromEmail
 * 3. Fallback to onboarding@resend.dev ONLY if no sender is configured
 */
export function getSenderAddress(): string {
  const customSender = (env.resendFromEmail || env.outreachFromEmail || '').trim();
  if (customSender) {
    return customSender;
  }
  return 'ClientPilot AI <onboarding@resend.dev>';
}

/**
 * Diagnostic helper to extract domain from email string
 */
function extractDomain(emailString: string): string {
  const match = emailString.match(/<([^>]+)>/) || [null, emailString];
  const email = (match[1] || emailString).trim();
  const parts = email.split('@');
  return parts.length === 2 ? parts[1].toLowerCase() : 'unknown';
}

export async function sendEmail({ to, subject, html, text, headers }: SendEmailParams) {
  const targetRecipient = to.trim();

  if (!resend) {
    console.warn('[Email] RESEND_API_KEY is not configured. Simulating delivery to:', targetRecipient);
    return { success: true, id: 'simulated_' + Date.now(), simulated: true };
  }

  const from = getSenderAddress();
  const senderDomain = extractDomain(from);
  const recipientDomain = extractDomain(targetRecipient);

  // Safe diagnostic logging (NEVER logs OTP codes, passwords, or API keys)
  console.log(`[Email Dispatch] Sending email:
  → Subject: "${subject}"
  → Sender: "${from}" (domain: @${senderDomain})
  → Target Recipient: "${targetRecipient}" (domain: @${recipientDomain})`);

  if (from.includes('onboarding@resend.dev')) {
    console.warn(
      '[Email Warning] Sender is set to "onboarding@resend.dev". ' +
      'Resend restricts onboarding@resend.dev to sending only to the account owner. ' +
      'To deliver to external users, configure RESEND_FROM_EMAIL with your verified domain in Render/environment variables.'
    );
  }

  try {
    const { data, error } = await resend.emails.send({
      from,
      to: targetRecipient,
      subject,
      html,
      text,
      headers,
    });

    if (error) {
      console.error('[Email Error] Resend API rejected message:', {
        name: error.name,
        message: error.message,
        statusCode: (error as any).statusCode || (error as any).status,
        senderDomain,
        targetRecipient,
      });
      throw new Error(error.message || 'Failed to deliver email through Resend');
    }

    console.log(`[Email Success] Delivered to Resend gateway. Message ID: ${data?.id}`);
    return { success: true, id: data?.id, simulated: false };
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err);
    console.error('[Email Exception] Dispatch failed:', message);
    throw new Error(message);
  }
}

// ─── Branded HTML Templates ───────────────────────────────────────────────────

export function getOtpEmailTemplate(otp: string, recipientName?: string) {
  const name = recipientName ? recipientName.trim() : 'there';
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verification Code - ClientPilot AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f7f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #ebecee;">
          <!-- Header -->
          <tr>
            <td style="padding: 36px 40px 24px; text-align: left; background: #0f141a; border-bottom: 2px solid #4cc02b;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #4cc02b; color: #ffffff; font-weight: 800; font-size: 20px; line-height: 40px; text-align: center;">CP</div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <div style="font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">ClientPilot <span style="color: #4cc02b;">AI</span></div>
                    <div style="font-size: 11px; color: #94a3b8; font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px;">Client Acquisition Platform</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          
          <!-- Content -->
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #141414; margin: 0 0 16px; letter-spacing: -0.5px;">Verify your email address</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 28px;">
                Hi ${name},<br>
                Thank you for joining ClientPilot AI. Use the 6-digit verification code below to verify your email and activate your account:
              </p>
              
              <!-- OTP Box -->
              <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 22px; text-align: center; margin: 0 0 28px;">
                <div style="font-family: 'SF Mono', Monaco, Consolas, 'Liberation Mono', 'Courier New', monospace; font-size: 36px; font-weight: 800; letter-spacing: 9px; color: #0f172a;">
                  ${otp}
                </div>
                <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 8px;">
                  Expires in 10 minutes (valid for 1 use)
                </div>
              </div>
              
              <p style="font-size: 14px; line-height: 1.5; color: #64748b; margin: 0 0 12px;">
                Enter this code on the verification screen to continue. For security reasons, do not share this code with anyone.
              </p>
              <p style="font-size: 13px; line-height: 1.5; color: #94a3b8; margin: 0;">
                If you did not request this verification, please safely ignore this email.
              </p>
            </td>
          </tr>
          
          <!-- Footer -->
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                &copy; ${new Date().getFullYear()} ClientPilot AI. All rights reserved. &bull; Enterprise-grade client acquisition.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
ClientPilot AI - Verification Code

Hi ${name},

Your verification code is: ${otp}

This code will expire in 10 minutes. Enter it on the verification screen to activate your account.
If you did not request this verification, please ignore this email.

ClientPilot AI - Acquire High-Value Clients
  `.trim();

  return { html, text };
}

export function getWelcomeEmailTemplate(name?: string) {
  const recipient = name ? name.trim() : 'there';
  const appUrl = env.appBaseUrl || env.frontendUrl || 'http://localhost:5173';

  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Welcome to ClientPilot AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f7f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #ebecee;">
          <tr>
            <td style="padding: 36px 40px 24px; text-align: left; background: #0f141a; border-bottom: 2px solid #4cc02b;">
              <table cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align: middle;">
                    <div style="width: 40px; height: 40px; border-radius: 10px; background: #4cc02b; color: #ffffff; font-weight: 800; font-size: 20px; line-height: 40px; text-align: center;">CP</div>
                  </td>
                  <td style="padding-left: 12px; vertical-align: middle;">
                    <div style="font-size: 19px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px;">ClientPilot <span style="color: #4cc02b;">AI</span></div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #141414; margin: 0 0 16px; letter-spacing: -0.5px;">Welcome aboard, ${recipient}! 🚀</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 20px;">
                Your account is now verified and active. Your dedicated workspace is ready to discover high-value prospects, analyze competitors, and automate client acquisition.
              </p>
              
              <div style="background: #f8fafc; border-radius: 14px; padding: 20px; margin: 0 0 28px; border: 1px solid #e2e8f0;">
                <div style="font-weight: 700; font-size: 14px; color: #1e293b; margin-bottom: 10px;">Quick start steps:</div>
                <ul style="margin: 0; padding-left: 20px; color: #475569; font-size: 13px; line-height: 1.6;">
                  <li><strong>Discover Leads:</strong> Search target categories and cities.</li>
                  <li><strong>AI Lead Scoring:</strong> Get instant digital gap & revenue fit evaluations.</li>
                  <li><strong>AI Outreach & Proposals:</strong> Generate personalized pitch decks and outreach in seconds.</li>
                </ul>
              </div>
              
              <div style="text-align: center; margin: 0 0 24px;">
                <a href="${appUrl}/app" style="display: inline-block; background-color: #141414; color: #ffffff; text-decoration: none; padding: 14px 32px; border-radius: 12px; font-weight: 700; font-size: 15px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);">
                  Launch Your Dashboard &rarr;
                </a>
              </div>
            </td>
          </tr>
          <tr>
            <td style="background-color: #f8fafc; padding: 20px 40px; border-top: 1px solid #f1f5f9; text-align: center;">
              <p style="font-size: 12px; color: #94a3b8; margin: 0;">
                &copy; ${new Date().getFullYear()} ClientPilot AI. Need help? Reply directly to this email.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
Welcome to ClientPilot AI, ${recipient}!

Your account has been verified and your workspace is ready.
Launch your dashboard now: ${appUrl}/app

ClientPilot AI - Acquire High-Value Clients
  `.trim();

  return { html, text };
}

export function getPasswordResetEmailTemplate(resetCode: string, name?: string) {
  const recipient = name ? name.trim() : 'there';
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Reset Your Password - ClientPilot AI</title>
</head>
<body style="margin: 0; padding: 0; background-color: #f6f7f9; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #141414;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #f6f7f9; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #ffffff; border-radius: 20px; box-shadow: 0 10px 30px rgba(0,0,0,0.06); overflow: hidden; border: 1px solid #ebecee;">
          <tr>
            <td style="padding: 36px 40px 24px; text-align: left; background: #0f141a; border-bottom: 2px solid #4cc02b;">
              <div style="font-size: 19px; font-weight: 800; color: #ffffff;">ClientPilot <span style="color: #4cc02b;">AI</span></div>
            </td>
          </tr>
          <tr>
            <td style="padding: 36px 40px;">
              <h1 style="font-size: 24px; font-weight: 800; color: #141414; margin: 0 0 16px;">Password Reset Request</h1>
              <p style="font-size: 15px; line-height: 1.6; color: #4b5563; margin: 0 0 24px;">
                Hi ${recipient},<br>
                We received a request to reset the password for your ClientPilot AI account. Use the code below to complete the reset:
              </p>
              <div style="background: #f8fafc; border: 2px dashed #cbd5e1; border-radius: 14px; padding: 22px; text-align: center; margin: 0 0 24px;">
                <div style="font-family: monospace; font-size: 34px; font-weight: 800; letter-spacing: 8px; color: #0f172a;">
                  ${resetCode}
                </div>
                <div style="font-size: 12px; font-weight: 600; color: #64748b; margin-top: 8px;">
                  Expires in 10 minutes
                </div>
              </div>
              <p style="font-size: 13px; color: #94a3b8; margin: 0;">
                If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();

  const text = `
ClientPilot AI - Password Reset Request

Hi ${recipient},

Your password reset code is: ${resetCode}

This code will expire in 10 minutes. If you did not request this, please ignore this email.
  `.trim();

  return { html, text };
}
