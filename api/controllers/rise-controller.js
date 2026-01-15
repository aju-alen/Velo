import dotenv from "dotenv";
import resend from "../utils/resend.js";
import { getContactFormEmail } from "../utils/emailTemplates/contactForm.js";
dotenv.config();

export const sendContact = async (req, res, next) => {
    const { name, email, phoneNumber, message } = req.body;
    try{
        await sendVerificationEmail(name, email, phoneNumber, message);
        res.status(200).json({message: "Email sent successfully"});        
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const sendVerificationEmail = async (name, email, phoneNumber, message) => {
    try {
        const emailData = getContactFormEmail(name, email, phoneNumber, message);
        await resend.emails.send(emailData);
        console.log("Contact form email sent successfully");
    }
    catch (err) {
        console.log("Err sending contact form email", err);
        throw err;
    }
}

