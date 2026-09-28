/**
 * Email templates for agent verification approve / reject decisions
 */

export const getVerificationApprovedEmail = (name, email) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Velo agent account has been approved',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
              Your logistic agent verification has been <b>approved</b>. You now have full access to agent features in the Velo app.
            </p>
            <p style="font-size: 15px; color: #555;">Open the app and sign in to continue.</p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};

export const getVerificationRejectedEmail = (name, email) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Your Velo agent verification was not approved',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px;">
            <h2 style="color: #F44336; margin-bottom: 12px;">Hi ${name},</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">
              Your logistic agent verification request was <b>not approved</b>. Please contact support or register again with valid documentation if you wish to reapply.
            </p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
