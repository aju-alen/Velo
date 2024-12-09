import express from "express";
const router = express.Router()
import { createNewShipment, getAllPaidShipments, getAllPendingShipments, getSinglePendingShipments, agentUpdateShipmentStatus } from "../controllers/shipment-controller.js";
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/create-new-shipment', verifyToken, createNewShipment);

router.get('/agent/get-all-pending-shipments', verifyToken, getAllPendingShipments); //get all pending shipments data for agents 

router.get('/agent/get-single-pending-shipments/:singleShipmentId', verifyToken, getSinglePendingShipments); //get single pending shipments data for agents 

router.get('/get-all-paid-shipments/:userId',verifyToken, getAllPaidShipments); //get all paid shipments of single user

router.put('/agent-update-shipment-status/:shipmentId', agentUpdateShipmentStatus); //update shipment status by agent


export default router;