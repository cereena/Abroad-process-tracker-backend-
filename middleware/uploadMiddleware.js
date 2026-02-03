import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";

const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "study-abroad-documents",
      resource_type: "auto",
      public_id: `doc_${Date.now()}`, // ❌ remove req.user usage
    };
  },
});

const upload = multer({ storage });

export default upload;
