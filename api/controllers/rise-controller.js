import dotenv from "dotenv";
import { PrismaClient } from "@prisma/client";
import resend from "../utils/resend.js";
import { getContactFormEmail } from "../utils/emailTemplates/contactForm.js";
dotenv.config();

const prisma = new PrismaClient();

export const sendContact = async (req, res, next) => {
  const name = String(req.body?.name || "").trim();
  const email = String(req.body?.email || "").trim();
  const phoneNumber = String(req.body?.phoneNumber || req.body?.phone || "").trim();
  const subject = String(req.body?.subject || "").trim();
  const country = String(req.body?.country || "").trim();
  const message = String(req.body?.message || "").trim();

  if (!name || !email || !message) {
    return res.status(400).json({ message: "Name, email, and message are required" });
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return res.status(400).json({ message: "Enter a valid email address" });
  }

  try {
    const contact = await prisma.contactInquiry.create({
      data: {
        name,
        email,
        phoneNumber: phoneNumber || null,
        country: country || null,
        message,
      },
    });

    await sendContactEmail({
      name,
      email,
      phoneNumber,
      subject,
      country,
      message,
    });

    res.status(200).json({ message: "Message sent successfully", id: contact.id });
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
