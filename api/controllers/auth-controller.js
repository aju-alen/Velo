import jwt from 'jsonwebtoken';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { createTransport } from "../utils/emailTransport.js";
import dotenv from "dotenv";
import { log } from "console";
import { get } from 'http';
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
    const mailOptions = {
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
    const mailOptionsOne = {
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
    //send the mail
    try {
        const sendEmailToAdmin = await createTransport.sendMail(mailOptions);
        const sendEmailToAgent = await createTransport.sendMail(mailOptionsOne);
    }
    catch (err) {
        console.log("Err sending verification email", err);
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