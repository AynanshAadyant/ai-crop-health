//middlware handles protected routes. checks for cookie stored, decrypts it and fetches user. user data then injected into request

import jwt from "jsonwebtoken";
import User from "../models/user.model.js"

const protectedRoute = async( req, res, next ) => {
    try{
        const auth = req.headers.authorization;
        if( !auth || !authHeader.startsWith('Bearer' )) {
            return res.status( 401 ).json( {
                success: false,
                status: 401,
                message: "No cookie found"
            })
        }
        
        const token = authHeader.split(' ' )[1];
        if( !token ) {
            console.error( "ERROR in spliting" );
            return res.status( 401 ).json( {
                success:  false,
                message: "Something went wrong",
                status: 500
            })
        }

        const decode = jwt.verify( token, process.env.ACCESS_TOKEN_SECRET );
        if( !decode ) {
            console.log( "ERROR in decoding token ");
            return res.status( 401 ).json( {
                success: false,
                status: 401,
                message: "Something went wrong"
            })
        }

        const id = decode._id;

        const user = await User.findById( _id );
        if( !user ) {
            console.log( "User not found" );
            res.status( 404 ).json( {
                message : "User not found",
                status: 404,
                success: false
            })
        }

        req.user = user;
        next();

    }
    catch( e ) {
        console.log( "ERROR in jwt middleware = ", e );
        return res.status( 500 ).json( {
            status: 500,
            success: false,
            message: "Something went wrong"
        })
    }
}

export { protectedRoute }