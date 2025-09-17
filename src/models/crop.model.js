import mongoose, { Mongoose } from "mongoose";

const cropSchema = new mongoose.Schema( {
    name : {
        type: String,
        required: true,
        lower : true
    },
    variety : {
        type: String
    },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    fieldLocation :{
        latitute: {
            type: Number, 
            min: -90, //south
            max: 90 //north
        },
        longitude: {
            type: Number,
            min: -180, //west
            max: 180 //east
        }
    },
    healthStatus: {
        type: String
    },
    isDeleted:{
        type: Boolean
    }
}, { timestamps : true})

const Crop = mongoose.model( "Crop", cropSchema );

export default Crop