import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { backendUrl } from "../utils/backendUrl.js";
import { createTransport } from "../utils/emailTransport.js";
import dotenv from "dotenv";
import { log } from "console";
dotenv.config();

const prisma = new PrismaClient();

export const addUserAddress = async (req, res, next) => {
    const {addressOne, addressTwo, city, state, country, zipCode, userId} = req.body;
    
    try{
        const createUserAddress = await prisma.userAddress.create({
            data: {
                addressOne: addressOne,
                addressTwo: addressTwo,
                city: city,
                state: state,
                countryId: Number(country),
                zipCode: zipCode,
                userId: userId
            }
        });
        await prisma.user.update({
            where: {
                id: userId
            },
            data: {
                registerVerificationStatus:"LOGGED_IN"
            }
        });

        const newUserData = await prisma.user.findUnique({
            where: {
                id: userId
            },
        });

        await prisma.$disconnect();
        sendWelcomeEmail(newUserData.email, newUserData.name);
        res.status(200).json({message: "Address added successfully and updated user", data: newUserData});

    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

//Send welcome email

const sendWelcomeEmail = async (email, name) => {

    const mailOptions = {
        from: process.env.EMAIL,
        to: email,
        subject: 'Welcome to Velo',
        html: `
    <html>
    <body>
        <div>

    
        </div>
        <div>
            <p>welcome ${name},</p>
            <p>Welcome to velo. Ship anywhere with care.</p>
            <br>
            <p>The Velo Team</p>
            <br>
           
            <br>
            <p>--------------------</p>
            <p>Copyright © 2024, Velo, its licensors and distributors. All rights are reserved, including those for text and data mining.</p>
            <br>
            <p>We use cookies to help provide and enhance our service. By continuing you agree to the use of cookies.</p>
        </div>
    </body>
    </html>`
    }

    //send the mail
    try {
        const response = await createTransport.sendMail(mailOptions);
        console.log("Verification email sent", response);
    }
    catch (err) {
        console.log("Err sending verification email", err);
    }
}



export const addExternalUserAddress = async (req, res, next) => {
    console.log(req.body,'external user address');
    
    try{
        const createExternalSavedAddress = await prisma.savedAddress.create({
            data: {...req.body,countryId:Number(req.body.countryId)}
        });
        await prisma.$disconnect();
        res.status(200).json({message: "Address added successfully"});


    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const addAgentAddress = async (req, res, next) => {
    const {userId,selectedCountries,selectedCategories} = req.body;    
    console.log(userId,selectedCountries);
    
    try{
        const agentCountryRecords = selectedCountries.map(countryId => ({
            agentId: userId,
            countryId,
          }));
        const createAgentAddress = await prisma.agentCountry.createMany({
            data: agentCountryRecords,
            skipDuplicates: true, // Optional: Skip duplicates if they already exist
          });
        
        const agentCategoryRecord = selectedCategories.map(categoryId => ({
            agentId: userId,
            categoryId,
          }));
        
        const createAgentCategory = await prisma.accountCtegory.createMany({
            data: agentCategoryRecord,
            skipDuplicates: true, // Optional: Skip duplicates if they already exist
          });


        await prisma.$disconnect();
        res.status(200).json({message: "Address added successfully"});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

export const getSingleUserAddress = async (req, res, next) => {
    try{
        const userId = req.params.userId;
        const userAddress = await prisma.userAddress.findMany({
            where: {
                userId: userId
            },
            include: {
                country: {
                    select: {
                        id: true,
                        name: true
                    }
                }

            }
        });
        await prisma.$disconnect();
        res.status(200).json({message: "User address fetched successfully", data: userAddress});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const getAllExternalSaveAddress = async (req, res, next) => {
    const {userId} = req.params;
    console.log(userId);
    log(req.params,'params');
    try{
        const savedContactAddress = await prisma.savedAddress.findMany({
            where: {
                userId: userId
            },
        });
        await prisma.$disconnect();
        
        const response = savedContactAddress.length > 0 ? savedContactAddress : {}; // Check if the result is empty
        
        res.status(200).json({
            message: "User address fetched successfully",
            data: response,
        });
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

