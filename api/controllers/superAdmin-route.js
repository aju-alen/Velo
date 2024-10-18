import crypto from "crypto";
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import nodemailer from "nodemailer";
import jwt from "jsonwebtoken";
import { backendUrl } from "../utils/backendUrl.js";
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const createNewCountry = async (req, res,next) => {
    try{
        const {countryName,countryIsoCode,countryIso3Code,countryCallingCode,countryRegion,countrySubRegion,countryCurrencyCode,countryCurrencyName,countryCurrencySymbol,countryFlag} = req.body;
        const countryExists = await prisma.country.findUnique({
            where: {
                iso3Code:countryIso3Code
            }
        });
        if(countryExists){
            return res.status(400).json({ message: "This country already exists" });
        }
        const newCountry = await prisma.country.create({
            data: {
                name: countryName,
                isoCode: countryIsoCode,
                iso3Code: countryIso3Code,
                callingCode: countryCallingCode,
                region: countryRegion,
                subRegion: countrySubRegion,
                currencyCode: countryCurrencyCode,
                currencyName: countryCurrencyName,
                currencySymbol: countryCurrencySymbol,
                flag: countryFlag,
            }
        });
        await prisma.$disconnect();
        return res.status(200).json({ message: "Country created successfully" });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

