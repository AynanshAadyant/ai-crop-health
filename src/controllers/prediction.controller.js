import Crop from "../models/crop.model.js";
import Prediction from "../models/prediction.model.js";

    let i = 1;

function predict(imageUrl) {
    //dummy prediction... to be integrated with ML service FastAPI server
    if( i++ % 2) {
        return { healthStatus: "Unhealthy", disease : "Early Blight", confidence : 97 }
    }
    else {
        return { healthStatus: "Healthy", disease : "", confidence : 99}
    }

}

const request = async( req, res ) => {
    try{
        console.log( "Making prediction" );
        const {image, crop} = req.body;
        const result = predict( image.imageUrl );

        const cropData = await Crop.findById( crop._id );
        if( !cropData ){
            return res.status( 404 ).json( {
                success: false,
                message: "Crop not found"
            })
        }
        cropData.healthStatus = result.healthStatus;
        if( !result ) {
            return res.status( 400 ).json( {
                message: "Result not generated",
                success: false,
                status: 400
            })
        }

        const prediction = await Prediction.create( {
            imageId : image._id,
            healthStatus: result.healthStatus,
            disease : result.disease || "",
            confidence : result.confidence || 0
        })
        console.log( "Prediction made" );
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
        console.log( "Fetching all predictions " );
        const predictions = await Prediction.find();
        if( !predictions || predictions.length === 0 ) {
            return res.status( 500 ).json( {
                message: "No predictions for this user",
                success: false,
                status: 500
            })
        }
        console.log( "All predictions fetched" );
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
        console.log("Fetching prediction id " );
        const {id} = req.params;
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
        console.log( "Prediction fetched successfully" );
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