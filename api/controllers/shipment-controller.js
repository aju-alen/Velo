import { PrismaClient } from '@prisma/client';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

export const createNewShipment = async (req, res, next) => {
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
        assignedOrganisationId,
        shipmentType,
        shippingMarket,
        shipmentStatus,
        openMarketPrice
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
                assignedOrganisationId,
                shipmentType,
                shippingMarket,
                shipmentStatus,
                openMarketPrice
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

export const getAllOpenMarketShipments = async (req, res, next) => {
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to view all pending shipments"); 
       const allPendingShipments = await prisma.shipment.findMany({
           where:{
               shipmentStatus:"ORDER_IN_MARKET"
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
    console.log(req.verifyOrganisationId,'middleware ID',req.params.organisationId,'params ID');
    
    try{
        if (req.verifyRole !== "AGENT" && req.params.organisationId !== req.verifyOrganisationId ) return res.status(403).send("You are not authorized to view all accepted shipments"); 
       const allAcceptedShipments = await prisma.shipment.findMany({
           where:{
                assignedOrganisationId:req.verifyOrganisationId,
              }
            });
          await prisma.$disconnect();
          console.log(allAcceptedShipments,'shippppppppig details ');
          
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
                orderPlacedAssignedAgentId:req.verifyUserId

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

export const getTotalAmount = async (req, res, next) => {
    const { organisationId, shipmentId } = req.params;
    console.log(organisationId, shipmentId);
    
    try{
        const shipment = await prisma.shipment.findUnique({
            where: {
              id: shipmentId,
            },
            select: {
              packageWeight: true,
              packageLength: true,
              packageWidth: true,
              packageHeight: true,
              packagePieces: true,
              shipmentType: true,
              verbalNotificationService: true,
              adultSignatureService: true,
              directSignatureService: true,

              assignedOrganisationId: true,
              organisationId: { 
                select: {
                  id: true,
                  organisationName: true,
                  documentPricePerPiece: true,
                  packagePricePerKg: true,
                  packagePricePerPiece: true,
                },
              },
            },
          });
        await prisma.$disconnect(); 

        
        
        
        if(shipment.assignedOrganisationId !== organisationId) return res.status(403).send("You are not authorized to view total amount of this shipment");
        let totalAmount = 0;
        let baseAmount = 0;
        let collectionPrice = 0;
        let servicesPrice = 0;
        if(shipment.shipmentType === "DOCUMENT"){
           baseAmount = (shipment.organisationId.documentPricePerPiece * shipment.packagePieces)
           
            collectionPrice = baseAmount * 0.1
           console.log(`collectionPrice: ${collectionPrice}`);
           
            servicesPrice = (shipment.verbalNotificationService? 10 : 0) +
                                 (shipment.adultSignatureService? 20 : 0) +
                                 (shipment.directSignatureService? 20 : 0);

            totalAmount = baseAmount + collectionPrice + servicesPrice;
        }
        else if(shipment.shipmentType === "PACKAGE"){
            baseAmount = (shipment.organisationId.packagePricePerKg * shipment.packageWeight) + (shipment.organisationId.packagePricePerPiece * shipment.packagePieces);
            collectionPrice = baseAmount * 0.1
            servicesPrice = (shipment.verbalNotificationService? 10 : 0) +
                                 (shipment.adultSignatureService? 20 : 0) +
                                    (shipment.directSignatureService? 20 : 0);
            totalAmount = baseAmount + collectionPrice + servicesPrice;
        }
    

        res.status(200).json({message:"Total amount of shipment",priceBreakdown:{baseAmount:baseAmount,collectionPrice:collectionPrice,servicesPrice:servicesPrice,totalAmount}});

    }
    catch(err){
        console.log(err);
        next(err);
    }
}

