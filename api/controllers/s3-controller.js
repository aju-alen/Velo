import dotenv from "dotenv";
import { Readable } from 'stream';
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';
import sharp from 'sharp';

dotenv.config();

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },

    region: process.env.AWS_REGION,
});

const IMAGE_MAX_WIDTH = 1200;
const IMAGE_JPEG_QUALITY = 82;

/**
 * Returns a readable stream for S3 upload: either raw buffer stream (PDF) or
 * Sharp resize+compress stream (images). Avoids buffering full compressed output.
 */
function createImageUploadStream(buffer, mimetype) {
    if (!mimetype || !mimetype.startsWith('image/')) {
        return { stream: Readable.from(buffer), contentType: mimetype || 'application/octet-stream' };
    }
    const sharpStream = sharp()
        .resize(320,240)
        .jpeg({ quality: IMAGE_JPEG_QUALITY });
    Readable.from(buffer).pipe(sharpStream);
    return { stream: sharpStream, contentType: 'image/jpeg' };
}

export const postProfileImageS3 = async (req, res, next) => {
    console.log(process.env.AWS_ACCESS_KEY_ID, process.env.AWS_SECRET_ACCESS_KEY, process.env.AWS_REGION);

    // Retrieve the body parameters
    const { id,name } = req.body;
    // Access the uploaded file through `req.file` since you're using `upload.single()`
    const file = req.file;
    console.log(file, 'file---');  // Log the uploaded file
    
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    console.log(file, 'file---');  // Log the uploaded file
    let params;
    // Define parameters for S3 upload
    if (file.mimetype === 'application/pdf') {
        params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `Account_verification/${id}-${name}/verificationfiles/verification.pdf`,
            Body: file.buffer,
            ContentType: file.mimetype,
        };
    } else {
        const { stream, contentType } = createImageUploadStream(file.buffer, file.mimetype);
        const imageName = file.originalname.replace(/\.[^.]+$/i, '.jpg');
        params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `Market_listing/${id}-${name}/${imageName}`,
            Body: stream,
            ContentType: contentType,
        };
    }
    // Define parameters for S3 upload
    

    try {
        const uploadResult = await new Upload({
            client: s3,
            params,
        }).done();

        console.log(uploadResult);

        // Get the location of the uploaded file
        const fileLocation = uploadResult.Location;

        // Send response with the uploaded file location
        res.status(200).json({ message: 'File uploaded successfully', data: fileLocation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading file' });
    }
};

export const postUpdateShipmentS3 = async (req, res, next) => {

    const { shipmentStatus,shipmentId,AgentStatus } = req.body;
    console.log(req.body, 'req.body---');

    const file = req.file;
    console.log(file, 'file---');
    
    if (!file) {
        return res.status(400).json({ error: 'No file uploaded' });
    }

    try {
        const { stream, contentType } = createImageUploadStream(file.buffer, file.mimetype);
        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            Key: `Shipment_Status/${req.verifyOrganisationId}/${req.verifyUserId}/${shipmentId}/${shipmentStatus}/${AgentStatus}/image.jpg`,
            Body: stream,
            ContentType: contentType,
        };
        const uploadResult = await new Upload({
            client: s3,
            params,
        }).done();

        console.log(uploadResult);

        // Get the location of the uploaded file
        const fileLocation = uploadResult.Location;

        // Send response with the uploaded file location
        res.status(200).json({ message: 'File uploaded successfully', data: fileLocation });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Error uploading file' });
    }
}