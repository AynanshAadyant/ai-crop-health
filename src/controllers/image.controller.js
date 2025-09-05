import Image from "../models/image.model.js";
import path from "path";
import fs from "fs";

const upload = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        status: 400,
        message: "No image uploaded",
      });
    }

    // File details from multer
    const { filename, path: filePath, mimetype, size } = req.file;

    // Ensure uploads directory exists
    const uploadDir = path.join(process.cwd(), "uploads");
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }

    // Build a public URL for accessing uploaded image
    const fileUrl = `/uploads/${filename}`; // This will work if you expose "uploads" as static

    return res.status(200).json({
      success: true,
      status: 200,
      message: "Image uploaded successfully",
      file: {
        filename,
        mimetype,
        size,
        path: filePath,
        url: fileUrl,
      },
    });
  } catch (e) {
    console.log("ERROR =", e);
    return res.status(500).json({
      message: "Something went wrong",
      status: 500,
      success: false,
    });
  }
};

const getImages = async( req, res ) => {
    try{
        const user = req.user;

        const images = await Image.find({ userId : user._id })

        if( !images || images.length === 0 ) {
            return res.status( 404 ).json({
                success: false,
                message: "No images for this user",
                status: 404
            })
        }

        return res.status( 200 ).json({
            success: true,
            message: "Images fetched successfully",
            status: 200
        })
    }
    catch( e ) {
        console.log( "ERROR =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const getImageById = async( req, res ) => {
    const { id } = req.params;
    if( !id ) {
        return res.status( 500 ).json({
            success: false,
            status: 500,
            message: "Id cannot be accessed from the URL"
        })
    }

    const image = await Image.findById( id );
    if( !image ) {
        return res.status( 200 ).json({
            success: false,
            status: 404,
            message: "Image not found"
        })
    }

    return res.status( 200 ).json({
        message: "Image fetched successfully",
        status: 200,
        success: true
    })
}

export { upload, getImages, getImageById };