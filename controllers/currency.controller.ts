import { Request, Response } from "express";
import { FindCurrencyByeSymbol } from "../db/currency/currency.utils";


export async function getByeSymbolHandler(req:Request, res:Response) {
    const symbol = req.params.symbol;
    if (!symbol) return res.status(400).json({
        message:"no symbol provided"
    });
    try {
        const currency = await FindCurrencyByeSymbol(symbol.toUpperCase());
        return res.status(200).json({
            message:"success",
            currency
        });
    } catch (err:any) { 
        return res.status(500).json({message:"some thing went wrong"});
    }
}
