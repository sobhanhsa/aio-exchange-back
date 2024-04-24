import mongoose, { ConnectionStates, MongooseError } from "mongoose";

const connection : {
    isConnected:ConnectionStates|null
} = {
    isConnected:null
}

export async function connectToDB() {
    try {
        if (connection.isConnected) return;
        const db = await mongoose.connect(process.env.DB_URl as string);
        console.log("db initialized");
        connection.isConnected = db.connections[0].readyState;
    } catch(error:any) {
        throw new Error(error);
    }
};
