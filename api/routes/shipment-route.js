import express from "express";
const router = express.Router()
import {
  createNewShipment,
  getAllPaidShipments,
  getAllOpenMarketShipments,
  getSinglePendingShipments,
  agentUpdateShipmentStatus,
  getAllAcceptedShipments,
  getTotalAmount,
  getSingleUserShipments,
  agentUpdateReadyPickupStatus,
  agentUpdatePickedUpStatus,
  trackShipmentByPublicId,
  getPublicShipmentTracking,
  saveShipmentDraft,
  getUserShipmentDrafts,
  getShipmentDraft,
  deleteShipmentDraft,
} from "../controllers/shipment-controller.js";
import { verifyToken } from "../middlewares/jwtVerify.js";

router.post('/create-new-shipment', verifyToken, createNewShipment);

router.post('/draft', verifyToken, saveShipmentDraft);
router.get('/drafts/:userId', verifyToken, getUserShipmentDrafts);
router.get('/draft/:draftId', verifyToken, getShipmentDraft);
router.delete('/draft/:draftId', verifyToken, deleteShipmentDraft);

router.get('/agent/get-all-open-market-shipments', verifyToken, getAllOpenMarketShipments);
router.get('/agent/get-all-accepted-shipments/:organisationId', verifyToken, getAllAcceptedShipments);

router.get('/getTotalAmount/:organisationId/:shipmentId', verifyToken, getTotalAmount);

router.get('/agent/get-single-pending-shipments/:singleShipmentId', verifyToken, getSinglePendingShipments);
router.get('/user/get-single-shipment/:singleShipmentId', verifyToken, getSingleUserShipments);
router.get('/track/:shipmentId', getPublicShipmentTracking);
router.get('/user/track/:shipmentId', verifyToken, trackShipmentByPublicId);

router.get('/get-all-paid-shipments/:userId', verifyToken, getAllPaidShipments);

router.put('/agent-update-shipment-status-open-market/:shipmentId', verifyToken, agentUpdateShipmentStatus);
router.put('/agent-update-shipment-status-ready-for-pickup/:shipmentId', verifyToken, agentUpdateReadyPickupStatus);
router.put('/agent-update-shipment-status-picked-up/:shipmentId', verifyToken, agentUpdatePickedUpStatus);

export default router;
