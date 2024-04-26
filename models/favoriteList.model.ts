import mongoose, { Schema, InferSchemaType , Types } from 'mongoose';

const favoriteListSchema = new Schema({
        user:{
            type:Schema.Types.ObjectId,
            ref:"User",
            required:true
        },
        items:{
            type:[
                {
                    type:Schema.Types.ObjectId,
                    ref:"Currency"
                }
            ],
            require:true,
            default:[]
        }
    },
    { timestamps: true }
);


export type FavoriteListType = InferSchemaType<typeof favoriteListSchema> & {
    _id:string
};

export type FavoriteListDtoType = Omit<
    FavoriteListType,
    "updatedAt"|"createdAt"|"NativeDate"|"_id"
>;



export const favoriteListModel = 
    mongoose.models.FavoriteList 
    ||
    mongoose.model("FavoriteList",favoriteListSchema)
;
