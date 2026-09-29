import express from 'express';
import { verifyToken, requireSuperAdmin } from '../middlewares/jwtVerify.js';
import {
  getAdminStats,
  getAdminSenders,
  getAdminAgents,
  getAdminShipments,
  getAdminPurchases,
  getAdminContactInquiries,
  getAdminListings,
} from '../controllers/admin-controller.js';
import {
  getAllAppointmentRequest,
  approveAgentAppointment,
  declineAgentAppointment,
} from '../controllers/superAdmin-route.js';

const router = express.Router();

router.use(verifyToken, requireSuperAdmin);

router.get('/stats', getAdminStats);
router.get('/senders', getAdminSenders);
router.get('/agents', getAdminAgents);
router.get('/shipments', getAdminShipments);
router.get('/purchases', getAdminPurchases);
router.get('/contact-inquiries', getAdminContactInquiries);
router.get('/listings', getAdminListings);
router.get('/appointment-requests', getAllAppointmentRequest);
router.put('/agents/:agentId/approve', approveAgentAppointment);
router.put('/agents/:agentId/decline', declineAgentAppointment);

export default router;
