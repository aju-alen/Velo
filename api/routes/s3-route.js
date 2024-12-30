import express from "express";
const router = express.Router()
import { postProfileImageS3,postUpdateShipmentS3} from '../controllers/s3-controller.js';
import multer from 'multer';
import { verifyToken } from "../middlewares/jwtVerify.js";
  // Configure multer for file upload
  const upload = multer();


router.post('/upload-to-aws', upload.single('document1'), postProfileImageS3);
router.post('/upload-to-aws-update-shipment',verifyToken, upload.single('image1'), postUpdateShipmentS3);

export default router;