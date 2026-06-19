import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import resend, { FROM_EMAIL } from "../utils/resend.js";
import { getAppointmentEmailToAgent, getAppointmentEmailToAdmin } from "../utils/emailTemplates/appointmentEmail.js";
import { getPasswordResetOTPEmail } from "../utils/emailTemplates/passwordResetOTP.js";
import dotenv from "dotenv";
import { log } from "console";
import { get } from 'http';
import { deleteFirebaseUserByPhone } from "../utils/firebaseAdmin.js";
dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res, next) => {
    const { name, role, email, password, mobile, code, country } = req.body;
    console.log(req.body);
    let userDetails;
    try {
        const userExists = await prisma.user.findUnique({
            where: {
                email
            }
        });

        const agentExists = await prisma.agent.findUnique({
            where: {
                email
            }
        });

        const superAdminExists = await prisma.superAdmin.findUnique({
            where: {
                email
            }
        });


        if (userExists || agentExists || superAdminExists) {
            return res.status(400).json({ message: "This email already exists or Mobile number already exist. You can login" });
        }

        const lowercaseEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        if (role === "AGENT") {
            userDetails = await prisma.agent.create({
                data: {
                    email: lowercaseEmail,
                    password: hashedPassword,
                    name,
                    role,
                    mobileNumber: mobile,
                    mobileCode: code,
                    mobileCountry: country,
                }
            });
          

        }
        else if (role === "USER") {
            userDetails = await prisma.user.create({
                data: {
                    email: lowercaseEmail,
                    password: hashedPassword,
                    name,
                    role,
                    mobileNumber: mobile,
                    mobileCode: code,
                    mobileCountry: country,
                }
            });
           
        }
        else if (role === "SUPERADMIN") {
            // userDetails = await prisma.superAdmin.create({
            //     data: {
            //         email: lowercaseEmail,
            //         password: hashedPassword,
            //         name,
            //         role,
            //         mobileNumber: mobile,
            //         mobileCode: code,
            //         mobileCountry: country,
            //     }
            // });
            // return res.status(400).json({ message: "Invalid role" });
        }
        else {
            return res.status(400).json({ message: "Invalid role" });
        }


        await prisma.$disconnect();

        console.log("User registered successfully", userDetails);
        if (!userDetails) {
            return res.status(400).json({ message: "User registration failed. please try again" });
        }
        if (userDetails) {
            return res.status(201).json({ message: "Agent registered successfully.", userDetails });
        }

    }
    catch (error) {
        console.log(error);
        res.status(500).json({ message: "An error has occoured, please contact support" });
    }
};

export const verifyAccountExist = async (req, res) => {
    const { mobileNumber, mobileCode } = req.params;
    console.log(mobileNumber, mobileCode);
    let accountExists;
    try {
        accountExists = await prisma.user.findFirst({
            where: {
                mobileNumber, mobileCode
            }
        });

        if (accountExists) {
            return res.status(200).json({ message: "Account exists", accountExists });
        }
        accountExists = await prisma.agent.findFirst({
            where: {
                mobileNumber, mobileCode
            }
        });

        if (accountExists) {
            return res.status(200).json({ message: "Account exists", accountExists });
        }
        return res.status(200).json({ message: "Account does not exist" });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const bookAgentAppointment = async (req, res, next) => {
    console.log(req.body);
    const { appointmentDate, agentId } = req.body;

    try {
        const agentInfo = await prisma.agent.update({
            where: {
                id: agentId
            },
            data: {
                appointmentDate,
                registerVerificationStatus: "APPOINTMENT_BOOKED"
            }
        })
        console.log(agentInfo,'agentInfo------');
        
        const getAgentInfo = await prisma.agent.findUnique({
            where:{
                id: agentId
            },
            select:{
                leadsOrganisation:{
                    select:{
                        modeOfWork:true
                    }
                }
            }
        });
        const generateTokenObject = {
            id: agentInfo.id,
            email: agentInfo.email,
            role: agentInfo.role,
            modeOfWork: getAgentInfo.leadsOrganisation.modeOfWork,
            organisationId: agentInfo.organisationId
        };
        const token = jwt.sign(generateTokenObject, process.env.JWT_SECRET_KEY);

        agentInfo["token"] = token;
        if (getAgentInfo?.leadsOrganisation?.modeOfWork) {
            agentInfo["modeOfWork"] = getAgentInfo.leadsOrganisation.modeOfWork;
        }
        

        await prisma.$disconnect();
        sendAppoitmentEmail(agentInfo.name, agentInfo.email, appointmentDate, agentId);
        res.status(200).json({ message: "Appointment booked successfully", agentInfo });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

const sendAppoitmentEmail = async (name, email, date, agentId) => {
    try {
        // Send email to agent
        const agentEmailData = getAppointmentEmailToAgent(name, email, date, agentId);
        await resend.emails.send(agentEmailData);
        
        // Send email to admin
        const adminEmailData = getAppointmentEmailToAdmin(name, date, agentId);
        await resend.emails.send(adminEmailData);
    }
    catch (err) {
        console.log("Err sending appointment email", err);
    }
}

export const loginAccount = async (req, res, next) => {
    log(req.body, 'req.body');
    const { email, password } = req.body;
    try {
        let accountExists = await prisma.user.findFirst({
            where: {
                email
            }
        });

        if (!accountExists) {
            accountExists = await prisma.agent.findFirst({
                where: {
                    email
                },
            });
        }
        if (!accountExists) {
            accountExists = await prisma.superAdmin.findFirst({
                where: {
                    email
                }
            });
        }
        if (!accountExists) {
            return res.status(400).json({ message: "User does not exist" });
        }
        const passwordMatch = await bcrypt.compare(password, accountExists.password);
        if (!passwordMatch) {
            return res.status(400).json({ message: "Password is incorrect" });
        }
        let getData;
        if(accountExists.role === "AGENT" ){
             getData = await prisma.agent.findUnique({
                where:{
                    email
                },
                select:{
                    organisationId:true,
                    leadsOrganisation:{
                        select:{
                            modeOfWork:true
                        }
                    }
                }
            });
        }
        
        const generateTokenObject = {
            id: accountExists.id,
            email: accountExists.email,
            role: accountExists.role,
            modeOfWork: getData?.leadsOrganisation?.modeOfWork || null,
            organisationId: getData?.organisationId || ''
        };
        console.log(generateTokenObject, 'generateTokenObject');
        

        const token = jwt.sign(generateTokenObject, process.env.JWT_SECRET_KEY);
        accountExists["token"] = token;
        if (getData?.leadsOrganisation?.modeOfWork) {
            accountExists["modeOfWork"] = getData.leadsOrganisation.modeOfWork;
        }
        return res.status(200).json({ message: "Login successful", accountExists });
    }
    catch (error) {
        console.log(error);
        next(error);
    }
}

export const checkMobileNumber = async (req, res, next) => {
    const { mobile } = req.query;
    console.log(mobile, 'mobile');
    const mobileNumber = await prisma.user.findFirst({
        where: {
            mobileNumber: mobile
        }
    });
    if(mobileNumber){
        return res.status(400).json({ message: "Mobile number already registered",continue:false });
    }
    return res.status(200).json({ message: "Mobile number not registered",continue:true });
}

export const checkEmailExists = async (req, res, next) => {
    const { email } = req.query;
    console.log(email, 'email to check');
    
    try {
        // Check in user table
        const userExists = await prisma.user.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (userExists) {
            return res.status(200).json({ exists: true, message: "Email already registered" });
        }

        // Check in agent table
        const agentExists = await prisma.agent.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (agentExists) {
            return res.status(200).json({ exists: true, message: "Email already registered" });
        }

        // Check in superAdmin table
        const superAdminExists = await prisma.superAdmin.findUnique({
            where: { email: email.toLowerCase() }
        });

        if (superAdminExists) {
            return res.status(200).json({ exists: true, message: "Email already registered" });
        }

        return res.status(200).json({ exists: false, message: "Email is available" });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Error checking email", error: error.message });
    }
}

export const changePassword = async (req, res) => {
  const { userId, currentPassword, newPassword } = req.body;
  try {
    // Find user (can be agent or user)
    let user = await prisma.user.findUnique({ where: { id: userId } });
    let userType = 'user';
    if (!user) {
      user = await prisma.agent.findUnique({ where: { id: userId } });
      userType = 'agent';
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check current password
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Current password is incorrect' });
    }
    // Hash new password and update
    const hashed = await bcrypt.hash(newPassword, 10);
    if (userType === 'user') {
      await prisma.user.update({ where: { id: userId }, data: { password: hashed } });
    } else {
      await prisma.agent.update({ where: { id: userId }, data: { password: hashed } });
    }
    res.status(200).json({ message: 'Password changed successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

const INCOMPLETE_REGISTRATION_STATUSES = ["PARTIAL", "APPOINTMENT_BOOKED"];

export const abandonRegistration = async (req, res) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({ message: "userId is required" });
  }

  try {
    const user = await prisma.user.findUnique({ where: { id: userId } });

    if (user) {
      if (!INCOMPLETE_REGISTRATION_STATUSES.includes(user.registerVerificationStatus)) {
        return res.status(400).json({ message: "Only incomplete registrations can be abandoned" });
      }

      await prisma.user.delete({ where: { id: userId } });
      await prisma.$disconnect();
      return res.status(200).json({ message: "Registration abandoned successfully" });
    }

    const agent = await prisma.agent.findUnique({ where: { id: userId } });

    if (agent) {
      if (!INCOMPLETE_REGISTRATION_STATUSES.includes(agent.registerVerificationStatus)) {
        return res.status(400).json({ message: "Only incomplete registrations can be abandoned" });
      }

      await prisma.organisation.deleteMany({
        where: { organisationLeaderAgentId: userId },
      });
      await prisma.agent.delete({ where: { id: userId } });
      await prisma.$disconnect();
      return res.status(200).json({ message: "Registration abandoned successfully" });
    }

    return res.status(404).json({ message: "Account not found" });
  } catch (err) {
    console.log(err);
    await prisma.$disconnect();
    return res.status(500).json({ message: "Failed to abandon registration" });
  }
};

export const deleteAccount = async (req, res) => {
  const { userId, password } = req.body;
  try {
    // Find user (can be agent or user)
    let user = await prisma.user.findUnique({ where: { id: userId } });
    let userType = 'user';
    if (!user) {
      user = await prisma.agent.findUnique({ where: { id: userId } });
      userType = 'agent';
    }
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Password is incorrect' });
    }
    // Delete Firebase auth user so the phone number can be reused
    try {
      await deleteFirebaseUserByPhone(user.mobileCode, user.mobileNumber);
    } catch (firebaseErr) {
      console.error('Firebase user deletion failed:', firebaseErr);
    }

    // Delete user/agent
    if (userType === 'user') {
      await prisma.user.delete({ where: { id: userId } });
    } else {
      await prisma.agent.delete({ where: { id: userId } });
    }
    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Helper function to generate 6-digit OTP
const generateOTP = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// Helper function to send reset password OTP email
const sendResetPasswordOTPEmail = async (name, email, otp) => {
  try {
    const emailData = getPasswordResetOTPEmail(name, email, otp);
    await resend.emails.send(emailData);
  } catch (err) {
    console.log("Error sending reset password OTP email", err);
    throw err;
  }
};

export const forgotPassword = async (req, res, next) => {
  const { email } = req.body;
  try {
    const lowercaseEmail = email.toLowerCase();
    
    // Check if user exists in any table
    let user = await prisma.user.findUnique({
      where: { email: lowercaseEmail }
    });
    let userType = 'user';
    
    if (!user) {
      user = await prisma.agent.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'agent';
    }
    
    if (!user) {
      user = await prisma.superAdmin.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'superAdmin';
    }
    
    // Don't reveal if email exists or not for security
    if (!user) {
      return res.status(200).json({ 
        message: "If an account with this email exists, a password reset OTP has been sent." 
      });
    }
    
    // Generate 6-digit OTP
    const otp = generateOTP();
    const hashedOTP = await bcrypt.hash(otp, 10);
    
    // Set expiry to 10 minutes from now
    const expiryDate = new Date();
    expiryDate.setMinutes(expiryDate.getMinutes() + 10);
    
    // Update user with reset token and expiry
    if (userType === 'user') {
      await prisma.user.update({
        where: { email: lowercaseEmail },
        data: {
          resetPasswordToken: hashedOTP,
          resetPasswordTokenExpiry: expiryDate
        }
      });
    } else if (userType === 'agent') {
      await prisma.agent.update({
        where: { email: lowercaseEmail },
        data: {
          resetPasswordToken: hashedOTP,
          resetPasswordTokenExpiry: expiryDate
        }
      });
    } else if (userType === 'superAdmin') {
      await prisma.superAdmin.update({
        where: { email: lowercaseEmail },
        data: {
          resetPasswordToken: hashedOTP,
          resetPasswordTokenExpiry: expiryDate
        }
      });
    }
    
    // Send OTP email
    await sendResetPasswordOTPEmail(user.name, user.email, otp);
    
    await prisma.$disconnect();
    
    return res.status(200).json({ 
      message: "If an account with this email exists, a password reset OTP has been sent." 
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

export const verifyResetPasswordOTP = async (req, res, next) => {
  const { email, otp } = req.body;
  try {
    const lowercaseEmail = email.toLowerCase();
    
    // Find user
    let user = await prisma.user.findUnique({
      where: { email: lowercaseEmail }
    });
    let userType = 'user';
    
    if (!user) {
      user = await prisma.agent.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'agent';
    }
    
    if (!user) {
      user = await prisma.superAdmin.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'superAdmin';
    }
    
    if (!user) {
      return res.status(400).json({ message: "Invalid email or OTP" });
    }
    
    // Check if reset token exists and is not expired
    if (!user.resetPasswordToken || !user.resetPasswordTokenExpiry) {
      return res.status(400).json({ message: "No active password reset request found" });
    }
    
    const now = new Date();
    if (new Date(user.resetPasswordTokenExpiry) < now) {
      return res.status(400).json({ message: "OTP has expired. Please request a new one." });
    }
    
    // Verify OTP
    const isOTPValid = await bcrypt.compare(otp, user.resetPasswordToken);
    if (!isOTPValid) {
      return res.status(400).json({ message: "Invalid OTP" });
    }
    
    // Generate JWT verification token (valid for 5 minutes)
    const verificationToken = jwt.sign(
      { 
        email: lowercaseEmail, 
        userType: userType,
        purpose: 'password_reset' 
      },
      process.env.JWT_SECRET_KEY,
      { expiresIn: '5m' }
    );
    
    await prisma.$disconnect();
    
    return res.status(200).json({ 
      message: "OTP verified successfully",
      verificationToken: verificationToken
    });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
};

export const resetPassword = async (req, res, next) => {
  const { email, verificationToken, newPassword } = req.body;
  try {
    // Verify JWT token
    let decoded;
    try {
      decoded = jwt.verify(verificationToken, process.env.JWT_SECRET_KEY);
    } catch (err) {
      return res.status(400).json({ message: "Invalid or expired verification token" });
    }
    
    // Check token purpose
    if (decoded.purpose !== 'password_reset') {
      return res.status(400).json({ message: "Invalid token purpose" });
    }
    
    // Verify email matches
    const lowercaseEmail = email.toLowerCase();
    if (decoded.email !== lowercaseEmail) {
      return res.status(400).json({ message: "Email mismatch" });
    }
    
    // Find user
    let user = await prisma.user.findUnique({
      where: { email: lowercaseEmail }
    });
    let userType = 'user';
    
    if (!user) {
      user = await prisma.agent.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'agent';
    }
    
    if (!user) {
      user = await prisma.superAdmin.findUnique({
        where: { email: lowercaseEmail }
      });
      userType = 'superAdmin';
    }
    
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    
    // Hash new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    
    // Update password and clear reset token fields
    if (userType === 'user') {
      await prisma.user.update({
        where: { email: lowercaseEmail },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null
        }
      });
    } else if (userType === 'agent') {
      await prisma.agent.update({
        where: { email: lowercaseEmail },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null
        }
      });
    } else if (userType === 'superAdmin') {
      await prisma.superAdmin.update({
        where: { email: lowercaseEmail },
        data: {
          password: hashedPassword,
          resetPasswordToken: null,
          resetPasswordTokenExpiry: null
        }
      });
    }
    
    await prisma.$disconnect();
    
    return res.status(200).json({ message: "Password reset successfully" });
  } catch (error) {
    console.log(error);
    await prisma.$disconnect();
    return res.status(500).json({ message: "An error occurred. Please try again." });
  }
};