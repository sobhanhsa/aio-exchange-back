import jwt from "jsonwebtoken";
import {UserModel} from "../models/userModel";
import { NextFunction, Request, Response } from "express";
import { connectToDB } from "../db/utils";

const protectRoute = async (req:Request, res:Response, next:NextFunction) => {
	try {
		const token = req.cookies.access_token;

		if (!token) {
			return res.status(401).json({ error: "Unauthorized - No Token Provided" });
		}

		const decoded : {id:string} = jwt
            .verify(token, process.env.SECRET as string) as any;

		if (!decoded) {
			return res.status(401).json({ error: "Unauthorized - Invalid Token" });
		}

        await connectToDB();

		const user = await UserModel.findById(decoded.id).select("-hash");

		if (!user) {
			return res.status(404).json({ error: "User not found" });
		}

		(req as any).user = user;

		next();
	} catch (error:any) {
		console.log("Error in protectRoute middleware: ", error.message);
		res.status(500).json({ error: "Internal server error" });
	}
};

export default protectRoute;