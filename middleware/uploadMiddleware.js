import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "study-abroad-documents",
      resource_type: "raw",        
      use_filename: true,
      unique_filename: false,
      attachment: true,  
      flags: "attachment",          
      public_id: `offer_${Date.now()}`,
    };
  },
});

const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
});

export default upload;