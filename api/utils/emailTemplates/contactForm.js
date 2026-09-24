/**
 * Email template for contact form submission
 * @param {object} data
 * @param {string} data.name
 * @param {string} data.email
 * @param {string} [data.phoneNumber]
 * @param {string} [data.subject]
 * @param {string} [data.country]
 * @param {string} data.message
 * @returns {object} Email data object for Resend
 */
export const getContactFormEmail = ({ name, email, phoneNumber, subject, country, message }) => {
  const escapeHtml = (value) =>
    String(value ?? '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');

  const safe = (value) => (value ? escapeHtml(value) : 'Not provided');

  return {
    from: process.env.EMAIL,
    to: process.env.SUPPORT_EMAIL || 'support@velointl.com',
    replyTo: email,
    subject: subject ? `New Contact Request: ${String(subject)}` : 'New Contact Request',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">New Contact Request</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">You have received a new contact form submission:</p>
            <div style="background: #f1f7ff; border-radius: 6px; padding: 18px 24px; margin-bottom: 24px;">
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Name:</b> ${safe(name)}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Email:</b> ${safe(email)}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Phone Number:</b> ${safe(phoneNumber)}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Subject:</b> ${safe(subject)}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Country:</b> ${safe(country)}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Message:</b></p>
              <p style="font-size: 16px; color: #333; margin: 8px 0; padding: 12px; background: #fff; border-radius: 4px; white-space: pre-wrap;">${safe(message)}</p>
            </div>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Velo Contact Form</p>
          </td>
        </tr>
      </table>
    </div>
    `,
  };
};
