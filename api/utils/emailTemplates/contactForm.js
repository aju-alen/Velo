/**
 * Email template for contact form submission
 * @param {string} name - Contact's name
 * @param {string} email - Contact's email
 * @param {string} phoneNumber - Contact's phone number
 * @param {string} message - Contact's message
 * @returns {object} Email data object for Resend
 */
export const getContactFormEmail = (name, email, phoneNumber, message) => {
  return {
    from: process.env.EMAIL,
    to: process.env.EMAIL, // Sending to admin/company email
    subject: 'New Contact Request',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">New Contact Request</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">You have received a new contact form submission:</p>
            <div style="background: #f1f7ff; border-radius: 6px; padding: 18px 24px; margin-bottom: 24px;">
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Name:</b> ${name}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Email:</b> ${email}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Phone Number:</b> ${phoneNumber}</p>
              <p style="font-size: 16px; color: #555; margin: 8px 0;"><b>Message:</b></p>
              <p style="font-size: 16px; color: #333; margin: 8px 0; padding: 12px; background: #fff; border-radius: 4px;">${message}</p>
            </div>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Velo Contact Form</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
