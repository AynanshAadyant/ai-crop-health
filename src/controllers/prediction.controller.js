import Image from "../models/image.model.js";
import Prediction from "../models/prediction.model.js";

function predict( imageId ) {
    return {
        healthStatus: 'Healthy',
        disease: "None",
        confidence: 9
    }
}

const request = async( req, res ) => {
    try{
        const user = req.user;
        const {image} = req.body;
        const result = predict( image.imageUrl );
        if( !result ) {
            return res.status( 400 ).json( {
                message: "Result not generated",
                success: false,
                status: 400
            })
        }

        const prediction = await Prediction.create( {
            userId : user._id,
            imageId : image._id,
            healthStatus: result.healthStatus,
            disease : result.disease || "",
            confidence : result.confidence || 0
        })

        return res.status( 200 ).json( {
            success: true,
            message: "Prediction made",
            status: 200,
            body : prediction
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

const getAll = async( req, res ) => {
    try{
        const user = req.user;
        
        const predictions = await Prediction.find( { userId : user._id } );
        if( !predictions || predictions.length === 0 ) {
            return res.status( 500 ).json( {
                message: "No predictions for this user",
                success: false,
                status: 500
            })
        }

        return res.status( 200 ).json( {
            message: "Predictions fetched successfully",
            status: 200,
            success: true,
            body : predictions
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

const getOne = async( req, res ) => {
    try{
        const id = req.params;
        if( !id ) {
            return res.status( 500 ).json( {
                message : "Id not accessible",
                success: false,
                status: 500
            })
        }

        const prediction = await Prediction.findById( id );
        if( !prediction ) {
            return res.status( 404 ).json( {
                message: "Prediction not found",
                success: false,
                status: 404
            })
        }
        
        return res.status( 200 ).json( {
            message: "Prediction fetched successfully",
            success: true,
            status: 200,
            body : prediction
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

export { request, getAll, getOne }