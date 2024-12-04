import nodemailer from 'nodemailer'

export const createTransport = nodemailer.createTransport({
    host: 'mail.privateemail.com',
    port: 587,
    secure: false,
    auth: {
        user: process.env.RISE_EMAIL_USER,
        pass: process.env.RISE_EMAIL_PASS
    }
})