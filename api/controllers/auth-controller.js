import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { backendUrl } from "../utils/backendUrl.js";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const register = async (req, res,next) => {
const {name,role,email,password,mobile,code,country} = req.body;
console.log(req.body);
let userDetails;
    try{
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

        if (userExists || agentExists) {
            return res.status(400).json({ message: "This email already exists or Mobile number already exist. You can login" });
        }

        const lowercaseEmail = email.toLowerCase();
        const hashedPassword = await bcrypt.hash(password, 10);

        if(role === "AGENT"){
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
            await prisma.$disconnect();
            
        }
        else if(role === "USER"){
            userDetails = await prisma.user.create({
                data: {
                    email: lowercaseEmail,
                    password: hashedPassword,
                    name,
                    role,
                    mobile,
                    mobileCode: code,
                    mobileCountry: country,
                }
            });
            await prisma.$disconnect();
        }
        
        console.log("User registered successfully", userDetails);
        if (!userDetails ) {
            return res.status(400).json({ message: "User registration failed. please try again" });
        }
        if(userDetails){
            return res.status(201).json({ message: "Agent registered successfully.", userDetails });
        }
        
    }
    catch(error){
        console.log(error);
        res.status(500).json({ message: "An error has occoured, please contact support" });
    }
};

export const verifyAccountExist = async (req, res) => { 
    const { mobileNumber,mobileCode } = req.params;
    console.log(mobileNumber,mobileCode);
    let accountExists;
    try {
        accountExists = await prisma.user.findFirst({
            where: {
                mobileNumber,mobileCode
            }
        });
        
        if(accountExists){
            return res.status(200).json({ message: "Account exists", accountExists });
        }
        accountExists = await prisma.agent.findFirst({
            where: {
                mobileNumber,mobileCode
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