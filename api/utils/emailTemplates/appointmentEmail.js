/**
 * Email template for appointment booking confirmation to agent
 * @param {string} name - Agent's name
 * @param {string} email - Agent's email
 * @param {string} date - Appointment date
 * @param {string} agentId - Agent ID
 * @returns {object} Email data object for Resend
 */
export const getAppointmentEmailToAgent = (name, email, date, agentId) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your appointment has been booked',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">Your appointment has been <b>successfully booked</b> for:</p>
            <div style="background: #f1f7ff; border-radius: 6px; padding: 18px 24px; margin-bottom: 24px;">
              <p style="font-size: 18px; color: #FFAC1C; margin: 0 0 8px 0;"><b>Appointment Date:</b> ${date}</p>
              <p style="font-size: 16px; color: #555; margin: 0;"><b>Agent ID:</b> ${agentId}</p>
            </div>
            <p style="font-size: 15px; color: #555;">If you have any questions, feel free to reply to this email.</p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};

/**
 * Email template for appointment booking notification to admin
 * @param {string} name - Agent's name
 * @param {string} date - Appointment date
 * @param {string} agentId - Agent ID
 * @returns {object} Email data object for Resend
 */
export const getAppointmentEmailToAdmin = (name, date, agentId) => {
  return {
    from: process.env.EMAIL,
    to: process.env.EMAIL,
    subject: 'Agent appointment booked',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Agent Appointment Booked</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">An appointment has been booked with the following details:</p>
            <table width="100%" cellpadding="0" cellspacing="0" style="background: #f1f7ff; border-radius: 6px; padding: 18px 24px; margin-bottom: 24px;">
              <tr>
                <td style="font-size: 16px; color: #555; padding: 8px 0;"><b>Name:</b></td>
                <td style="font-size: 16px; color: #FFAC1C; padding: 8px 0;">${name}</td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555; padding: 8px 0;"><b>Appointment Date:</b></td>
                <td style="font-size: 16px; color: #FFAC1C; padding: 8px 0;">${date}</td>
              </tr>
              <tr>
                <td style="font-size: 16px; color: #555; padding: 8px 0;"><b>Agent ID:</b></td>
                <td style="font-size: 16px; color: #FFAC1C; padding: 8px 0;">${agentId}</td>
              </tr>
            </table>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Velo Admin Notification</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
