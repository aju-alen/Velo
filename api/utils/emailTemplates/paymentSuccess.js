/**
 * Email template for payment success notification
 * @param {string} email - Customer's email
 * @param {number} price - Payment amount
 * @param {string} currency - Payment currency
 * @param {string} receiptUrl - Receipt URL
 * @returns {object} Email data object for Resend
 */
export const getPaymentSuccessEmail = (email, price, currency, receiptUrl) => {
  return {
    from: process.env.EMAIL,
    to: email,
    subject: 'Payment Success - Velo',
    html: `
    <div style="font-family: Arial, sans-serif; background: #f9f9f9; padding: 32px;">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: auto; background: #fff; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.05);">
        <tr>
          <td style="padding: 32px 32px 16px 32px;">
            <h2 style="color: #FFAC1C; margin-bottom: 12px;">Payment Successful!</h2>
            <p style="font-size: 16px; color: #333; margin-bottom: 24px;">Your payment has been successfully processed.</p>
            <div style="background: #f1f7ff; border-radius: 6px; padding: 18px 24px; margin-bottom: 24px;">
              <p style="font-size: 18px; color: #FFAC1C; margin: 0 0 8px 0;"><b>Amount Paid:</b> ${currency.toUpperCase()} ${price}</p>
            </div>
            <p style="font-size: 15px; color: #555; margin-bottom: 16px;">Please find your receipt below:</p>
            <div style="text-align: center; margin: 24px 0;">
              <a href="${receiptUrl}" style="display: inline-block; background-color: #FFAC1C; color: #fff; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: 600;">View Receipt</a>
            </div>
            <p style="font-size: 14px; color: #888; margin-top: 24px;">Thank you for using our service.</p>
            <p style="margin-top: 32px; color: #888; font-size: 13px;">Best regards,<br/>The Velo Team</p>
          </td>
        </tr>
      </table>
    </div>
    `
  };
};
