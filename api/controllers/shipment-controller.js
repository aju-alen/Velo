import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const createNewShipment = async (req, res, next) => {
    console.log(req.body);
    const { 
        userId,
        senderName,
        senderAddressOne,
        senderAddressTwo,
        senderCity,
        senderState,
        shipmentDate,
        deliveryDate,
        receiverName,
        receiverAddressOne,
        receiverAddressTwo,
        receiverCity,
        receiverState,
        receiverEmail,
        receiverMobileNumber,
        receiverCountryId,
        receiverCountryCode,
        receiverResidentAddress,
        receiverZipCode,
        packageLength,
        packageWidth,
        packageHeight,
        packageWeight,
        packagePieces,
        verbalNotificationService,
        adultSignatureService,
        directSignatureService,
        pickupTimeFrom,
        pickupTimeTo,
        pickupInstructions,
        pickupSpecialInstructions,
        packageDescription,
    } = req.body;
    try {
        const newShipment = await prisma.shipment.create({
            data: {
                userId,
                senderName,
                senderAddressOne,
                senderAddressTwo,
                senderCity,
                senderState,
                shipmentDate,
                deliveryDate,
                receiverName,
                receiverAddressOne,
                receiverAddressTwo,
                receiverCity,
                receiverState,
                receiverEmail,
                receiverMobileNumber,
                receiverCountryId,
                receiverCountryCode,
                receiverResidentAddress,
                receiverZipCode,
                packageLength,
                packageWidth,
                packageHeight,
                packageWeight,
                packagePieces,
                verbalNotificationService,
                adultSignatureService,
                directSignatureService,
                pickupTimeFrom,
                pickupTimeTo,
                pickupInstructions,
                pickupSpecialInstructions,
                packageDescription,
            }
        });
        
        await prisma.$disconnect();

        return res.status(200).json({ message: "Shipment created successfully",shipmentId:newShipment.id});
    }
    catch (err) {
        console.log(err);
        next(err);
    }
}

export const getAllPaidShipments = async (req, res, next) => {
    const { userId } = req.params;
    try{
        const allPaidShipments = await prisma.shipment.findMany({
            where: {
                userId,
                paymentSuccess: true
            }
        });
        await prisma.$disconnect();
        return res.status(200).json(allPaidShipments);
                
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

