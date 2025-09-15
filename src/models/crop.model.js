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
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
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
    healthIndex: {
        type: Number //score of 0-100 from model
    },
    isDeleted:{
        type: Boolean
    }
}, { timestamps : true})

const Crop = mongoose.model( "Crop", cropSchema );

export default Crop