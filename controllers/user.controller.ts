import { isEmailValid } from "../validators";
import { isUsernameValid } from "../validators";

import { Request, Response , NextFunction } from "express";

import jwt from "jsonwebtoken";

import bcrypt from "bcrypt";
import { UserModel, UserType } from "../models/user.model";
import { connectToDB } from "../db/utils";
const saltRounds = 10;


export async function signupHandler(req : Request, res : Response) {
    
    if (req.cookies.access_token) {
        res.status(406).json({"message":"you are already logged in"})
        return
    }

    type dto = {
        username:string,
        email:string,
        password:string
    }

    const body : dto = req.body;

    if (
        (!body.username) || (!body.email) ||
        (!body.password) || (typeof body.password !== "string")
    ) {
        return res.status(422).json({"message":"invalid body"});
    }

    //check email
    if (!isEmailValid(String(body.email))) {
        return res.status(422).json({"message":"invalid email"});
    }

    //check username
    if (!isUsernameValid(String(body.username))) {
        return res.status(422).json({"message":"invalid username"});
    };

    try {
        await connectToDB();

        const hash = await bcrypt.hash(body.password,saltRounds);
        const user = await UserModel.create({...body,hash});
        
        const token = jwt
        .sign({ id: user._id}, process.env.SECRET as string);
        
        user.hash="";

        let expireDate = new Date(Date.now() + 15*24*60*60*1000);

        res.cookie("access_token", token, {
            expires: expireDate,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
        });

        res.cookie("access_token_expire", expireDate, {
            expires: expireDate,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
        });

        res.cookie("user", JSON.stringify(user), {
            expires: expireDate,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
        });
        

        return res.status(201).json({
            message:"success",
            user:user
        })

    } catch (err:any) {
        console.log(err.message);
        if ((err.message as string).includes("E11000")) {
            return res.status(403).json(
                {
                    message:"duplicated username or email",
                    error:err
                }
            )
        }
        return res.status(500).json(
            {
                message:"failure",
                error:err
            }
        )
    }
};

export async function loginHandler(req:Request, res:Response) {

    if (req.cookies.access_token) {
        return res.status(406).json({"message":"you are already logged in"})
    };

    const body : {username?:string,email?:string,password:string} = req.body;

    if (
        ((!body.username) && (!body.email)) || (typeof body.password !== "string")
    ) {
        return res.status(422).json({"message":"invalid body"});
    }

    //check email || username
    if (
        !isEmailValid(String(body.email)) 
        &&
        !isUsernameValid(String(body.username))
    ) {
    
        return res.status(422).json({"message":"invalid email"});
    }

    let query = body.username ? {
        username:body.username
    } : {
        email:body.email
    };

    await connectToDB();

    const user : UserType | null = await UserModel.findOne(query);

    if (!user) return res.status(400).json({"message":"no account exists",user})
    
    const bResult = await bcrypt.compare(body.password,user.hash as string)
    
    user.hash = ""
    
    if (!bResult) return res.status(403)
        .json({"message":"incorrect password",user:null});

    const token = jwt.sign({ id: user._id}, process.env.SECRET as string);

    let expireDate = new Date(Date.now() + 14*24*60*60*1000);


    //set cookie
    res.cookie("access_token", token, {
        expires: expireDate,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    });
    
    res.cookie("access_token_expire", expireDate, {
        expires: expireDate,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    });

    res.cookie("user", JSON.stringify(user), {
        expires: expireDate,
        secure: false,
        httpOnly: true,
        sameSite: 'lax',
    });

    return res.status(200).json({
        "message":"success",
        "user":user
    });

};

export function logoutHandler(req:Request, res:Response) {

    if (!req.cookies.access_token) {
        res.status(403).json({"message":"you're not logged in"})
        return
    };

    return res
        .clearCookie("user")
        .clearCookie("access_token")
        .clearCookie("access_token_expire")
        .status(200)
        .json({ message: "you're successfully logged out"});
}

export async function authorizeHandler(req:Request, res:Response) {

    const token = req.cookies.access_token;
    
    if (!token) {
        return res
            .status(403)
            .json(
                {"message":"you're not logged in"}
            );
    }

    try {

        
        const data = jwt
        .verify(token, process.env.SECRET as string) as {id:string};
                
        
        await connectToDB();

        const user = await UserModel.findById(data.id);

        if (!user) return res.status(403).json({"message":"invalid id"});

        user.hash = "";

        const userExpireDate = new Date(req.cookies.access_token_expire);

        res.cookie("user", user, {
            expires: userExpireDate,
            secure: false,
            httpOnly: true,
            sameSite: 'lax',
        });

        return res.status(200).json({message:"authorized"});
    } catch(e) {
        console.log(e);
        return res.status(500).json({"message":"some thing went wrong"});
    };
}
