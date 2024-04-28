import mongoose, { Schema, InferSchemaType , Types } from 'mongoose';

const userSchema = new Schema({
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
        favorites:{
            required:false,
            type:[String],
            default:[],
        }
    },
    { timestamps: true }
);


export type UserType = InferSchemaType<typeof userSchema> & {
    _id:string
};

export type UserDtoType = Omit<
    UserType,
    "updatedAt"|"createdAt"|"NativeDate"|"_id"
>;



export const UserModel = mongoose.models.User || mongoose.model("User",userSchema);
