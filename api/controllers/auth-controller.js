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
            return res.status(400).json({ message: "Invalid role" });
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
            modeOfWork: getAgentInfo.leadsOrganisation.modeOfWork
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
        text: `
        Hi ${name},

        Your appointment has been booked successfully for ${date}.
        `}
    const mailOptionsOne = {
        from: process.env.EMAIL,
        to: process.env.EMAIL,
        subject: 'Agent appointment booked',
        text: `
        Hello,

        An appointment has been booked for 
        Name - ${name} 
        Appointment Date - ${date}
        AgentId - ${agentId}
        `}


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
            modeOfWork: getData?.leadsOrganisation?.modeOfWork || null
        };

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