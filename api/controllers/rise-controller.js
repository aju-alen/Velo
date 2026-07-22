import dotenv from "dotenv";
import resend from "../utils/resend.js";
import { getContactFormEmail } from "../utils/emailTemplates/contactForm.js";
dotenv.config();

export const sendContact = async (req, res, next) => {
  const {
    name,
    email,
    phoneNumber,
    phone,
    subject,
    country,
    message,
  } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  try {
    await sendContactEmail({
      name,
      email,
      phoneNumber: phoneNumber || phone || "",
      subject: subject || "",
      country: country || "",
      message,
    });
    res.status(200).json({ message: "Email sent successfully" });
  } catch (err) {
    console.log(err);
    next(err);
  }
};

const sendContactEmail = async (payload) => {
  try {
    const emailData = getContactFormEmail(payload);
    await resend.emails.send(emailData);
    console.log("Contact form email sent successfully");
  } catch (err) {
    console.log("Err sending contact form email", err);
    throw err;
  }
};
