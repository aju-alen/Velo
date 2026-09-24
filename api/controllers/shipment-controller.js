import { PrismaClient } from '@prisma/client';
import { nanoid } from 'nanoid';
import dotenv from "dotenv";
dotenv.config();

const prisma = new PrismaClient();

const SHIPMENT_STATUS_ORDER = [
    'PAYMENT_PENDING',
    'ORDER_IN_MARKET',
    'ORDER_PLACED',
    'ORDER_CONFIRMED',
    'SHIPMENT_PICKED',
    'SHIPMENT_DROPPED',
    'IN_TRANSIT_START',
    'IN_TRANSIT_END',
    'OUT_FOR_DELIVERY',
    'DELIVERED',
];

const STATUS_IMAGE_KEY_MAP = {
    SHIPMENT_PICKED: 'awsAgentShipmentPickedUrl',
    SHIPMENT_DROPPED: 'awsAgentShipmentDroppedUrl',
    IN_TRANSIT_START: 'awsAgentInTransitStartUrl',
    IN_TRANSIT_END: 'awsAgentInTransitEndUrl',
    OUT_FOR_DELIVERY: 'awsAgentOutForDeliveryUrl',
    DELIVERED: 'awsAgentDeliveredUrl',
};

const buildShipmentTimeline = (shipment) => {
    const currentStatus = shipment?.shipmentStatus;
    const currentIndex = SHIPMENT_STATUS_ORDER.indexOf(currentStatus);

    return SHIPMENT_STATUS_ORDER.map((status, index) => {
        const imageKey = STATUS_IMAGE_KEY_MAP[status];
        return {
            status,
            label: status.replace(/_/g, ' '),
            completed: currentIndex >= 0 && index < currentIndex,
            current: index === currentIndex,
            imageUrl: imageKey ? shipment[imageKey] || null : null,
        };
    });
};

const PUBLIC_STATUS_LABELS = {
    PAYMENT_PENDING: 'Payment pending',
    ORDER_IN_MARKET: 'Waiting for an agent',
    ORDER_PLACED: 'Booked',
    ORDER_CONFIRMED: 'Booked',
    SHIPMENT_PICKED: 'Collected',
    SHIPMENT_DROPPED: 'Handed to shipping partner',
    IN_TRANSIT_START: 'In transit',
    IN_TRANSIT_END: 'In transit',
    OUT_FOR_DELIVERY: 'Out for delivery',
    DELIVERED: 'Delivered',
};

const PUBLIC_TRACKING_STEPS = [
    { key: 'BOOKED', label: 'Booked', statuses: ['ORDER_PLACED', 'ORDER_CONFIRMED'] },
    { key: 'COLLECTED', label: 'Collected', statuses: ['SHIPMENT_PICKED'] },
    { key: 'HANDED_OVER', label: 'Handed to shipping partner', statuses: ['SHIPMENT_DROPPED'] },
    { key: 'IN_TRANSIT', label: 'In transit', statuses: ['IN_TRANSIT_START', 'IN_TRANSIT_END'] },
    { key: 'OUT_FOR_DELIVERY', label: 'Out for delivery', statuses: ['OUT_FOR_DELIVERY'] },
    { key: 'DELIVERED', label: 'Delivered', statuses: ['DELIVERED'] },
];

const publicShipmentSelect = {
    shipmentId: true,
    shipmentStatus: true,
    shipmentDate: true,
    deliveryDate: true,
    senderCity: true,
    senderState: true,
    receiverCity: true,
    receiverState: true,
};

const buildPublicTracking = (shipment, source) => {
    const currentIndex = PUBLIC_TRACKING_STEPS.findIndex((step) =>
        step.statuses.includes(shipment.shipmentStatus)
    );

    return {
        shipmentId: shipment.shipmentId,
        status: shipment.shipmentStatus,
        statusLabel: PUBLIC_STATUS_LABELS[shipment.shipmentStatus] || shipment.shipmentStatus,
        shipmentDate: shipment.shipmentDate,
        deliveryDate: shipment.deliveryDate,
        from: [shipment.senderCity, shipment.senderState].filter(Boolean).join(', '),
        to: [shipment.receiverCity, shipment.receiverState].filter(Boolean).join(', '),
        source,
        timeline: PUBLIC_TRACKING_STEPS.map((step, index) => ({
            key: step.key,
            label: step.label,
            completed: currentIndex >= 0 && index < currentIndex,
            current: index === currentIndex,
        })),
    };
};

export const getPublicShipmentTracking = async (req, res, next) => {
    const publicId = (req.params.shipmentId || '').trim();

    try {
        if (!publicId) {
            return res.status(400).json({ message: 'Tracking number is required' });
        }

        let shipment = await prisma.shipment.findFirst({
            where: { shipmentId: publicId },
            select: publicShipmentSelect,
        });
        let source = 'active';

        if (!shipment) {
            shipment = await prisma.completedShipment.findFirst({
                where: { shipmentId: publicId },
                select: publicShipmentSelect,
            });
            source = 'completed';
        }

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        return res.status(200).json({
            tracking: buildPublicTracking(shipment, source),
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

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
                receiverCountryId : Number(receiverCountryId),
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
        const [activeShipments, completedShipments] = await Promise.all([
            prisma.shipment.findMany({ where: { userId } }),
            prisma.completedShipment.findMany({ where: { userId } }),
        ]);
        const allPaidShipments = [...activeShipments, ...completedShipments].sort(
            (a, b) => new Date(b.shipmentDate) - new Date(a.shipmentDate)
        );
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

export const getSingleUserShipments = async (req, res, next) => {
    const {singleShipmentId} = req.params;

    try{
        if (req.verifyRole !== "USER") return res.status(403).send("You are not authorized to view single user shipments"); 
        let singleUserShipments = await prisma.shipment.findFirst({
            where:{
                userId:req.verifyUserId,
                id:singleShipmentId
            }
        });
        let source = 'active';
        if (!singleUserShipments) {
            singleUserShipments = await prisma.completedShipment.findFirst({
                where:{
                    userId:req.verifyUserId,
                    id:singleShipmentId
                }
            });
            source = 'completed';
        }
        await prisma.$disconnect();
        if (!singleUserShipments) {
            return res.status(404).json({ message: 'Shipment not found' });
        }
        return res.status(200).json({ ...singleUserShipments, source });
    }
    catch(err){
        console.log(err);
        next(err);
    }
}

export const trackShipmentByPublicId = async (req, res, next) => {
    const { shipmentId } = req.params;
    const publicId = (shipmentId || '').trim();

    try {
        // Read-only lookup: any authenticated user can track by public shipment ID
        if (!req.verifyUserId) {
            return res.status(403).send('You are not authorized to track shipments');
        }
        if (!publicId) {
            return res.status(400).json({ message: 'Shipment ID is required' });
        }

        let shipment = await prisma.shipment.findFirst({
            where: {
                shipmentId: publicId,
            },
        });
        let source = 'active';

        if (!shipment) {
            shipment = await prisma.completedShipment.findFirst({
                where: {
                    shipmentId: publicId,
                },
            });
            source = 'completed';
        }

        await prisma.$disconnect();

        if (!shipment) {
            return res.status(404).json({ message: 'Shipment not found' });
        }

        return res.status(200).json({
            ...shipment,
            source,
            timeline: buildShipmentTimeline(shipment),
        });
    } catch (err) {
        console.log(err);
        next(err);
    }
};

export const agentUpdateShipmentStatus = async (req, res, next) => {
    const { shipmentId } = req.params;
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to update shipment status");
        const updateShipment = await prisma.shipment.update({
            where: {
                id: shipmentId
            },
            data:{
                shipmentStatus:"PAYMENT_PENDING",
                assignedOrganisationId:req.verifyOrganisationId,
                shippingMarket:"CLOSED_MARKET",
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

export const agentUpdateReadyPickupStatus = async (req, res, next) => {
    const { shipmentId } = req.params;
    try{
        if (req.verifyRole !== "AGENT") return res.status(403).send("You are not authorized to update shipment status");
        const existing = await prisma.shipment.findUnique({
            where: { id: shipmentId },
            select: { shipmentId: true },
        });
        const updateShipment = await prisma.shipment.update({
            where: {
                id: shipmentId
            },
            data:{
                shipmentStatus:"ORDER_CONFIRMED",
                ...(!existing?.shipmentId ? { shipmentId: nanoid(10) } : {}),
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

export const agentUpdatePickedUpStatus = async (req, res, next) => {
    console.log(req.body, 'req.body in pick up');
    console.log(req.params, 'req.params in pick up');
    const { shipmentStatus, imageUrl, status } = req.body;
    console.log(req.body,'req.body in pick up');
    

    try {
        const dynamicKey = STATUS_IMAGE_KEY_MAP[shipmentStatus];

        if (!dynamicKey) {
            return res.status(400).json({ message: 'Invalid shipment status' });
        }

        const dynamicData = { [dynamicKey]: imageUrl };

        const existingShipment = await prisma.shipment.findUnique({
            where: { id: req.params.shipmentId },
            select: { shipmentId: true },
        });

        // Ensure public tracking ID exists for paid / mid-lifecycle shipments
        const ensurePublicId =
            !existingShipment?.shipmentId &&
            ['ORDER_PLACED', 'ORDER_CONFIRMED', 'SHIPMENT_PICKED', 'SHIPMENT_DROPPED', 'IN_TRANSIT_START', 'IN_TRANSIT_END', 'OUT_FOR_DELIVERY', 'DELIVERED'].includes(shipmentStatus)
                ? { shipmentId: nanoid(10) }
                : {};

        const updateShipment = await prisma.shipment.update({
            where: {
                id: req.params.shipmentId,
            },
            data: {
                shipmentStatus,
                imageStatus: status,
                pickUpAgentId: req.verifyUserId,
                ...dynamicData,
                ...ensurePublicId,
            },
        });

        if(shipmentStatus === "DELIVERED"){
            const completedPayload = {
                ...updateShipment,
                id: req.params.shipmentId,
                shipmentId: updateShipment.shipmentId || nanoid(10),
            };
            await prisma.completedShipment.create({
                data: completedPayload,
              });
          
              // Delete from Shipment table
              await prisma.shipment.delete({
                where: { id: req.params.shipmentId },
              });
        }

        res.status(200).json({ message: 'Shipment status updated successfully' });
    } catch (err) {
        console.error(err);
        next(err);
    }
};



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
              customPrice: true,
              openMarketPrice: true,

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
          
        if(shipment.customPrice){

            baseAmount = shipment.openMarketPrice;
            console.log(`baseAmount: ${baseAmount}`);
            
            
            collectionPrice = baseAmount * 0.1;
            servicesPrice = (shipment.verbalNotificationService? 10 : 0) +
                                 (shipment.adultSignatureService? 20 : 0) +
                                 (shipment.directSignatureService? 20 : 0);
            totalAmount = baseAmount + collectionPrice + servicesPrice;
        }
        else if(shipment.shipmentType === "DOCUMENT" && !shipment.customPrice ){
           baseAmount = (shipment.organisationId.documentPricePerPiece * shipment.packagePieces)
           
            collectionPrice = baseAmount * 0.1
           console.log(`collectionPrice: ${collectionPrice}`);
           
            servicesPrice = (shipment.verbalNotificationService? 10 : 0) +
                                 (shipment.adultSignatureService? 20 : 0) +
                                 (shipment.directSignatureService? 20 : 0);

            totalAmount = baseAmount + collectionPrice + servicesPrice;
        }
        else if(shipment.shipmentType === "PACKAGE" && !shipment.customPrice){
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

