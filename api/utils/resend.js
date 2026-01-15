import { Resend } from 'resend';
import dotenv from 'dotenv';

dotenv.config();

// Initialize Resend with API key from environment variable
// Placeholder: Replace with your actual Resend API key in .env file
const resend = new Resend(process.env.RESEND_API_KEY || 're_placeholder_api_key_here');

// Get the sender email from environment variable
export const FROM_EMAIL = process.env.EMAIL || 'noreply@velo.com';

export default resend;
