import { Request, Response } from "express";
import { FindAllCurrency, FindCurrencyByeSymbol } from "../db/currency/currency.utils";
import { CurrencyType } from "../models/currency.model";


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

export async function getAllCurrencylHandler(req:Request, res:Response) {
    const from = Number(req.query.from) || 1;
    const to = Number(req.query.to) || 10;

    if (to - from < 0) return res.status(400).json({message:"invalid params"});

    try {
        const currencies : CurrencyType[] = await FindAllCurrency(from,to);
        console.log("getAllCurrencylHandler : ",currencies.length);
        return res.status(200).json({
            message:"success",
            currencies
        });
    } catch (err:any) { 
        return res.status(500).json({message:"some thing went wrong"});
    }
}
