import Prediction from "../models/prediction.model.js";

const request = async( req, res ) => {
    try{}
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
    try{}
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
    try{}
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