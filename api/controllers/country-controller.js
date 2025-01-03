import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const getAllCountry = async (req, res, next) => {
    try {
        const countries = await prisma.country.findMany({
            select: {
                id: true,
                name: true,
            },
        });
        await prisma.$disconnect();
        return res.status(200).json( countries );
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

