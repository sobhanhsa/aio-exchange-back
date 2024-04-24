import mongoose, { Schema, InferSchemaType , Types } from 'mongoose';

const currencySchema = new Schema({
        hash:{
            type:String,
            required:true
        },
        username: {
            unique:true,
            type: String,
            required: true,
            min: 3,
            max: 20,
        },
        email: {
            unique:true,
            type: String,
            required: true,
        },
        messages : {
            type:[{type:mongoose.Types.ObjectId,ref:"Message"}],
            default:[]
        },
    },
    { timestamps: true }
);


export type CurrencyType = InferSchemaType<typeof currencySchema> & {
    _id:string
};



export const CurrencyModel = 
    mongoose.models.Currency 
    ||
    mongoose.model("Currency",currencySchema)
;
