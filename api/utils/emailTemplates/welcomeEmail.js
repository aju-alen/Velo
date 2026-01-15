/**
 * Email template for welcome email
 * @param {string} email - User's email
 * @param {string} name - User's name
 * @returns {object} Email data object for Resend
 */
export const getWelcomeEmail = (email, name) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Welcome to Velo',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Welcome ${name}!</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">Welcome to Velo. Ship anywhere with care.</p>
            <p style="font-size: 15px; color: #555; margin-bottom: 24px;">We're excited to have you on board. Start shipping with confidence and ease.</p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
            <hr style="border: none; border-top: 1px solid #eee; margin: 32px 0;" />
            <p style="color: #888; font-size: 12px; margin: 0;">Copyright © 2024, Velo, its licensors and distributors. All rights are reserved, including those for text and data mining.</p>
            <p style="color: #888; font-size: 12px; margin: 8px 0 0 0;">We use cookies to help provide and enhance our service. By continuing you agree to the use of cookies.</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
