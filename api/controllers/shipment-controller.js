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
        senderEmail,
        senderMobileNumber,
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
        if (req.verifyRole !== "USER" && req.verifyUserId !== userId) return res.status(403).send("You are not authorized to create a shipment"); 
        const newShipment = await prisma.shipment.create({
            data: {
                userId,
                senderName,
                senderAddressOne,
                senderAddressTwo,
                senderCity,
                senderState,
                senderEmail,
                senderMobileNumber,
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
        if (req.verifyRole !== "USER" && req.verifyUserId !== userId) return res.status(403).send("You are not authorized to view paid shipments"); 
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

export const getAllPendingShipments = async (req, res, next) => {
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to view all pending shipments"); 
       const allPendingShipments = await prisma.shipment.findMany({
           where:{
               shipmentStatus:"ORDER_PLACED"
           }
         });
        await prisma.$disconnect();
        return res.status(200).json(allPendingShipments);
                
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export const getAllAcceptedShipments = async (req, res, next) => {
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to view all accepted shipments"); 
       const allAcceptedShipments = await prisma.shipment.findMany({
           where:{
                shipmentStatus:"ORDER_CONFIRMED",
                assignedAgentId:req.verifyUserId
              }
            });
          await prisma.$disconnect();
          return res.status(200).json(allAcceptedShipments);
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export const getSinglePendingShipments = async (req, res, next) => {
    const { singleShipmentId } = req.params;
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to view single pending shipments"); 
        const singlePendingShipments = await prisma.shipment.findUnique({
            where:{
                id:singleShipmentId
            }
        });
        await prisma.$disconnect();
        return res.status(200).json(singlePendingShipments);

    }
    catch(err){
        console.log(err);
        next(err);
    }

}

export const agentUpdateShipmentStatus = async (req, res, next) => {
    const { shipmentId } = req.params;
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to update shipment status");
        const updateShipment = await prisma.shipment.update({
            where: {
                id: shipmentId
            },
            data:{
                shipmentStatus:"ORDER_CONFIRMED",
                assignedAgentId:req.verifyUserId

            }
        });
        await prisma.$disconnect();
        return res.status(200).json({ message: "Shipment status updated successfully" });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

