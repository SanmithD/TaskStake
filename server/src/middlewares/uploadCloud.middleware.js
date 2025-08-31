import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from '../config/cloudinary.config.js';

const storage = new CloudinaryStorage({
  cloudinary,
  params: { folder: "todo-stakes", resource_type: "image" }
});
export const uploadPhoto = multer({ storage });
