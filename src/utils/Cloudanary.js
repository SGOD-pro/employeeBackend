import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs'
import { ApiErrors } from './ApiErrors.js';

const cloudinaryUpload = async (filePath) => {
    try {
        cloudinary.config({
            cloud_name: process.env.CLOUDINARY_NAME,
            api_key: process.env.CLOUDINARY_KEY,
            api_secret: process.env.CLOUDINARY_SECRET
        });
        if (!filePath) {
            return null
        }
        console.log(filePath);
        const responce = await cloudinary.uploader.upload(filePath,
            { resource_type: "auto" });
        fs.unlinkSync(filePath)
        return responce;
    } catch (error) {
        fs.unlinkSync(filePath)
        throw new ApiErrors(500, "Faild to upload images.");
    }
}

export { cloudinaryUpload }