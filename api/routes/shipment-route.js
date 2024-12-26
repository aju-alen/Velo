import express from "express";
const router = express.Router()
import { createNewShipment, getAllPaidShipments, getAllOpenMarketShipments, getSinglePendingShipments, agentUpdateShipmentStatus,getAllAcceptedShipments,getTotalAmount,getSingleUserShipments } from "../controllers/shipment-controller.js";
import { verifyToken } from "../middlewares/jwtVerify.js";



router.post('/create-new-shipment', verifyToken, createNewShipment);

router.get('/agent/get-all-open-market-shipments', verifyToken, getAllOpenMarketShipments); //get all pending shipments data for agents 
router.get('/agent/get-all-accepted-shipments/:organisationId', verifyToken, getAllAcceptedShipments); //get all pending shipments data for agents 

router.get('/getTotalAmount/:organisationId/:shipmentId',verifyToken, getTotalAmount); //get total amount of single shipment

router.get('/agent/get-single-pending-shipments/:singleShipmentId', verifyToken, getSinglePendingShipments); //get single pending shipments data for agents 
router.get('/user/get-single-shipment/:singleShipmentId', verifyToken, getSingleUserShipments); //get single pending shipments data for agents 

router.get('/get-all-paid-shipments/:userId',verifyToken, getAllPaidShipments); //get all paid shipments of single user

router.put('/agent-update-shipment-status-open-market/:shipmentId',verifyToken, agentUpdateShipmentStatus); //update shipment status by agent for open market shipments


export default router;