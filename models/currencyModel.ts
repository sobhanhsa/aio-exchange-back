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
        price:{
            required:true,
            type:Number
        },
        percentChangeWeek:{
            type:Number
        },
        percentChangeDay:{
            type:Number
        },
        history:{
            type:[{time:Date,price:Number}],
            required:false
        },
        currencyType:{
            type:String,
            required:true
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
