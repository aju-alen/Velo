import express from "express";
const router = express.Router()
import { createNewShipment,getAllPaidShipments } from "../controllers/shipment-controller.js";



router.get('/get-all-paid-shipments/:userId', getAllPaidShipments);
router.post('/create-new-shipment', createNewShipment);



export default router;