import { v2 as cloudinary } from 'cloudinary';
import fs from "fs"

const uploadOnCloudinary = async (filePath) => {
      // Configuration
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET 
    });

    try {
        // Upload an image
        const uploadResult = await cloudinary.uploader.upload(filePath);
        fs.unlinkSync(filePath); // Remove file from server after upload
        return uploadResult.secure_url 
    } catch (error) {
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath); // Remove file from server in case of error
        }
        throw new Error(`Cloudinary Upload Error: ${error.message}`);
    }
}

export default uploadOnCloudinary;