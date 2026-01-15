/**
 * Email template for password reset OTP
 * @param {string} name - User's name
 * @param {string} email - User's email
 * @param {string} otp - 6-digit OTP code
 * @returns {object} Email data object for Resend
 */
export const getPasswordResetOTPEmail = (name, email, otp) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Reset Your Password - Velo',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">You requested to reset your password. Use the following OTP to proceed:</p>
            <div style="background: #f1f7ff; border-radius: 6px; padding: 24px; margin-bottom: 24px; text-align: center;">
              <p style="font-size: 32px; color: #FFAC1C; margin: 0; font-weight: bold; letter-spacing: 4px;">${otp}</p>
            </div>
            <p style="font-size: 14px; color: #888; margin-bottom: 8px;"><b>This OTP will expire in 10 minutes.</b></p>
            <p style="font-size: 14px; color: #888; margin-bottom: 24px;">If you didn't request this password reset, please ignore this email.</p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
