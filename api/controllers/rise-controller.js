
import dotenv from "dotenv";
import nodemailer from "nodemailer";
dotenv.config();

export const sendContact = async (req, res, next) => {
    const { name, email, phoneNumber, message } = req.body;
    try{
        sendVerificationEmail(name,email,phoneNumber,message);
        res.status(200).json({message: "Email sent successfully"});        
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

const createTransport = nodemailer.createTransport({
    host: 'mail.rightintellectual.ae',  // Replace with your domain's mail server
    port: 587,                    // Commonly used port for sending emails with STARTTLS
    secure: false,                 // STARTTLS (not SSL)
    auth: {
        user: process.env.RISE_EMAIL_USER,  // Your email address
        pass: process.env.RISE_EMAIL_PASS   // Your email password
    }
})

const sendVerificationEmail = async (name,email,phoneNumber,message) => {
 

    const transporter = createTransport;
    console.log(transporter, 'transporter');
    const mailOptions = {
        from: process.env.RISE_EMAIL_USER,
        to: process.env.RISE_EMAIL_USER,
        subject: 'New Contact Request',
        html: `
<html>
<body>
    <div>

       
        <p>New Rise Form</p>

    </div>
    <div>
        <p>Hi ${name},</p>
        <p>You got a new form</p>
        <br>
        <p>
        Name: ${name}
        Email: ${email}
        Phone Number: ${phoneNumber}
        Message: ${message}        
        </p>
        <br>
    </div>
</body>
</html>`
    }

    //send the mail
    try {
        const response = await transporter.sendMail(mailOptions);
        console.log("Verification email sent", response);
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}

