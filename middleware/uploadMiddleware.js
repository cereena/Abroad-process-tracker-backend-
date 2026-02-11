import multer from "multer";
import { CloudinaryStorage } from "multer-storage-cloudinary";
import cloudinary from "../config/cloudinary.js";
import path from "path";

const storage = new CloudinaryStorage({
  cloudinary,

  params: async (req, file) => {
    const ext = path.extname(file.originalname); // .pdf .jpg .png

    return {
      folder: "study-abroad-documents",

      resource_type: "auto",

      // REMOVE format (let cloudinary decide)
      // format: undefined 

      public_id: `doc_${Date.now()}_${Math.round(
        Math.random() * 1e9
      )}`,

      use_filename: true,
      unique_filename: false,
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
