import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { backendUrl } from "../utils/backendUrl.js";
import dotenv from "dotenv";
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
        await prisma.$disconnect();
        res.status(200).json({message: "Address added successfully and updated user", data: createUserAddress});

    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const addAgentAddress = async (req, res, next) => {
    const {userId,selectedCountries} = req.body;    
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
        // await prisma.$disconnect();
        res.status(200).json({message: "Address added successfully"});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
};

