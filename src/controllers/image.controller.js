import Image from "../models/image.model.js";
import uploadToCloudinary from "../utils/uploadImage.js";

const uploadImage = async (req, res) => {
  try {
    console.log( "Uploading Image" );
    const imageLocal = req.file;
    if( !imageLocal ) {
      return res.status( 500 ).json( {
        success: false,
        status: 500,
        message: "Image not accessible"
      })
    }
    const uploadedFile = await uploadToCloudinary( imageLocal.path );
    if( !uploadedFile ) {
      return res.status( 500 ).json( {
        success: false,
        status: 500,
        message: "File not uploaded to cloud storage"
      })
    }

    const image = await Image.create( {
      imageUrl: uploadedFile.url,
      isDeleted: false
    })
    console.log( "Image uploaded" );
    return res.status(200).json({
      success: true,
      status: 200,
      message: "Image uploaded successfully",
      body : uploadedFile.url,
      image : image
    });
  } catch (e) {
    console.error("ERROR =", e);
    return res.status(500).json({
      message: "Something went wrong",
      status: 500,
      success: false,
    });
  }
};

const getImages = async( req, res ) => {
    try{
      console.log( "Fetching all images" );
        const images = await Image.find({ isDeleted: false })

        if( !images || images.length === 0 ) {
            return res.status( 404 ).json({
                success: false,
                message: "No images for this user",
                status: 404
            })
        }
        console.log( "Images fetched" );
        return res.status( 200 ).json({
            success: true,
            message: "Images fetched successfully",
            status: 200,
            body : images
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
  console.log( "Fetching a particular image" );
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
    if( image.isDeleted ) {
      return res.status( 400 ).json({
        message: "The Image has been deleted",
        success: false
      })
    }
    console.log( "Image fetched successfully" );
    return res.status( 200 ).json({
        message: "Image fetched successfully",
        status: 200,
        success: true,
        body : image
    })
}

const deleteImage = async( req, res ) => {
  console.log( "Deleting image" );
  const {id} = req.params;
  const image = await Image.findById( id );
  if( !image ) {
    return res.status( 404 ).json( {
      message: "Image not found",
      success: false,
      status: 404
    })
  }

  image.isDeleted = true;
  await image.save();
  console.log( "Image deleted" );
  return res.status( 200 ).json( {
    success: true,
    message: "Image deleted successfully",
    status: 200
  })
}

export { uploadImage, getImages, getImageById, deleteImage };