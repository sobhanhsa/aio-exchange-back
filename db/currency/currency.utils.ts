import { CurrencyDtoType, CurrencyModel, CurrencyType } from "../../models/currency.model";
import { connectToDB } from "../utils";

export const CreateCurrency = async (
    {
        symbol,
        name,
        price,
        currencyType,
        cap,
        percentChangeWeek,
        percentChangeDay,
        history
    }:CurrencyDtoType
) => {
    try {
        await connectToDB();
        const currency = await CurrencyModel.create({
            symbol,
            name:{
                en:name?.en,
                fa:name?.fa
            },
            currencyType,
            price,
            cap,
            percentChangeWeek,
            percentChangeDay
        });
    } catch (err:any) {
        throw new Error(err.messsage);
    }
};

export const UpdateCurrency = async (
    {
        symbol,
        name,
        price,
        currencyType,
        cap,
        percentChangeWeek,
        percentChangeDay,
        history
    }:CurrencyDtoType
) => {
    try {
        await connectToDB();
        const currency = await CurrencyModel.updateOne({
            symbol
        },{
            symbol,
            name:{
                en:name?.en,
                fa:name?.fa
            },
            currencyType,
            price,
            cap,
            percentChangeWeek,
            percentChangeDay
        });
    } catch (err:any) {
        throw new err.message
    }
};


export const FindCurrencyByeSymbol = async (symbol:string) => {
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