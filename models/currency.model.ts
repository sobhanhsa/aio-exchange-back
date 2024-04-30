import mongoose, { Schema, InferSchemaType , Types } from 'mongoose';

const currencySchema = new Schema({
        symbol:{
            required:true,
            type:String
        },
        name:{
            en:String,
            fa:String
        },
        cap:{
            type:Number,
        },
        priceIrr:{
            type:Number,
            required:false

        },
        price:{
            required:false,
            type:Number
        },
        percentChangeWeek:{
            type:Number
        },
        percentChangeDay:{
            type:Number
        },
        history:{
            type:[{time:{type:Date,required:true},price:{type:Number,required:true}}],
            required:false
        },
        currencyType:{
            type:String,
            required:true
        },
        time:{
            required:false,
            type:Date,
            default:Date.now
        }
    },
    { timestamps: true }
);


export type CurrencyType = InferSchemaType<typeof currencySchema> & {
    _id:string
};

export type CurrencyDtoType = Omit<
    CurrencyType,
    "updatedAt"|"createdAt"|"NativeDate"|"_id"
>;



export const CurrencyModel = 
    mongoose.models.Currency 
    ||
    mongoose.model("Currency",currencySchema)
;
