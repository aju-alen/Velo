import dotenv from "dotenv";
import { Upload } from '@aws-sdk/lib-storage';
import { S3 } from '@aws-sdk/client-s3';

dotenv.config();

const s3 = new S3({
    credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID,
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    },

    region: process.env.AWS_REGION,
});
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

    // Define parameters for S3 upload
    const params = {
        Bucket: process.env.S3_BUCKET_NAME,
        // Key: `${id}/verificationfiles/${file.originalname}`, // File name you want to save in S3
        Key: `Account_verifiaction/${id}-${name}/verificationfiles/verification.pdf`, // File name you want to save in S3
        Body: file.buffer,
        ContentType: file.mimetype,
    };

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

        const params = {
            Bucket: process.env.S3_BUCKET_NAME,
            // Key: `${id}/verificationfiles/${file.originalname}`, // File name you want to save in S3
            Key: `Shipment_Status/${req.verifyOrganisationId}/${req.verifyUserId}/${shipmentId}/${shipmentStatus}/${AgentStatus}/image.jpg`, 
            Body: file.buffer,
            ContentType: file.mimetype,
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