import Crop from "../models/crop.model.js";

const addCrop = async( req, res ) => {
    console.log( "Adding a new crop" );
    const { name, variety="", fieldLocation={ latitude:undefined, longitude:undefined} } = req.body;
    const user = req.user;

    if( !name ) {
        return res.status( 400 ).json( {
            message: "Please enter name of crop",
            status: 400,
            success: false
        })
    }

    const cropAlreadyPresent = await Crop.findOne( { name, user } );
    if( cropAlreadyPresent ) {
        return res.status( 401 ).json( {
            status: 401, 
            message: "Crop already added",
            success: false
        })
    }

    const crop = await Crop.create( {
        name, variety, user, fieldLocation 
    })

    return res.status( 200 ).json( {
        success: true,
        status: 200,
        message: "Crop added successfully"
    })
}

const getAllCrops = async( req, res ) => {
    console.log( "Fetching all crops for the user" );
    const user = req.user;
    const crops = await Crop.find( { user, isDeleted: false } );
    if( !crops || !Array.isArray(crops) )
        return res.status( 500 ).json( {
            success: false,
            status: 500,
            message: "Something went wrong while fetching all crops of the user"
    })

    if( crops.length === 0 ) {
        return res.status( 200 ).json({
            message: "No Crop data up till now",
            success: true,
            status: 200,
            body: []
        })
    }

    return res.status( 200 ).json({
        success: true,
        status: 200,
        message: "Crops data fetched successfully",
        body: crops
    })
}

const getCropById = async( req, res ) => {
    console.log( "Fetching a particular crop of a particular user" );
    const { id } = req.params;
    const crop = await Crop.findOne( {_id: id, isDeleted: false} );
    if( !crop ) {
        return res.status( 404 ).json( {
            message: "Crop not found",
            success: false,
            status: 404
        })
    }
    return res.status( 200 ).json({
        message: "Crop found successfully",
        success:  true,
        status: 200
    })
}

const removeCrop = async( req, res ) => {
    console.log( "Deleting a crop by id" );
    const { id } = req.params;
    if( !id ) {
        return res.status( 404 ).json({
            message: "ID not accessisble",
            success: false,
            status: 404
        })
    }

    const crop = await Crop.findById( id );
    if( !crop ){
        return res.status( 404 ).json( {
            message: "Crop not found",
            success: false,
            status: 404
        })
    }

    crop.isDeleted = true;
    await crop.save();

    return res.status( 200 ).json( {
        message: "Crop data deleted successfully",
        success: true,
        status: 200
    })
}

export { addCrop, getAllCrops, getCropById, removeCrop }

