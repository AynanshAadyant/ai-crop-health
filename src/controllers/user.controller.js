import User from "../models/user.model.js";

const signup = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR in sign up =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const login = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR in login =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const getUser = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR in getUser =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

const logout = async( req, res ) => {
    try{}
    catch( e ) {
        console.log( "ERROR in logout =", e );
        return res.status( 500 ).json( {
            message: "Something went wrong",
            status: 500,
            success: false
        })
    }
}

export { signup, login, getUser, logout }