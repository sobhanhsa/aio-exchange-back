import { CurrencyModel } from "../../models/currencyModel";
import { connectToDB } from "../utils";

export const CreateCurrency = async (
    symbol:string,
    nameEn:string,
    nameFa:string,
    price:number,
    cap?:number,
    percentChangeWeek?:number,
    percentChangeDay?:number,
    history?:{price:number,time:Date}[]
) => {
    try {
        await connectToDB();
        const currency = await CurrencyModel.create({
            symbol,
            name:{
                en:nameEn,
                fa:nameFa
            },
            price,
            cap,
            percentChangeWeek,
            percentChangeDay
        });
    } catch (err:any) {
        throw new err.message
    }
};

export const UpdateCurrency = async (
    symbol:string,
    nameEn:string,
    nameFa:string,
    price:number,
    cap?:number,
    percentChangeWeek?:number,
    percentChangeDay?:number,
    history?:{price:number,time:Date}[]
) => {
    try {
        await connectToDB();
        const currency = await CurrencyModel.updateOne({
            symbol
        },{
            symbol,
            name:{
                en:nameEn,
                fa:nameFa
            },
            price,
            cap,
            percentChangeWeek,
            percentChangeDay
        });
    } catch (err:any) {
        throw new err.message
    }
};


export const FindCurrency = async (symbol:string) => {
    try {
        connectToDB();
        const currency = await CurrencyModel.findOne({
            symbol
        });
        return currency
    } catch (err:any) {
        throw err.message
    }
}