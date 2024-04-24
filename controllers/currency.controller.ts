import { Request, Response } from "express";
import { FindCurrency } from "../db/currency/utils";


export async function getByeSymbol(req:Request, res:Response) {
    const symbol = req.params.symbol;
    if (!symbol) return res.status(400).json({
        message:"no symbol provided"
    });
    try {
        const currency = await FindCurrency(symbol);
        return res.status(200).json({
            message:"success",
            currency
        });
    } catch (err:any) { 
        return res.status(500).json({message:"some thing went wrong"});
    }
}
