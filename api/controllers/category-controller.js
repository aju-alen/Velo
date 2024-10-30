import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const getAllCategory = async (req, res, next) => {
    try {
        const categories = await prisma.category.findMany({
            select: {
                id: true,
                name: true,
                categoryImgUrl: true,
            },
        });
        await prisma.$disconnect();
        return res.status(200).json( categories );
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

