import { CreateCurrency, UpdateCurrency } from "../../db/currency/currency.utils";
import { connectToDB } from "../../db/utils";
import { CurrencyModel } from "../../models/currency.model";
import { transformers } from "../../transformers";
import { priceToTransformer } from "../../transformers/priceTo.transformer";
import { wallexTransformer } from "../../transformers/wallex.transformer";

export const SyncGlobalCrypto = async(ref:'wallex'|'priceTo') => {
    try {
        const currencies = await transformers[ref](); 

        await connectToDB();

        currencies.forEach(async(c) => {
            //POST or UPDATE each currency
            const existed = await CurrencyModel.exists({
                symbol:c.symbol
            });
            if (!existed) {
                await CreateCurrency(
                    {
                        symbol: c.symbol,
                        name:{
                            en: c.name.en,
                            fa: c.name.fa
                        },
                        price:{
                            usd:c.price.usd,
                        },
                        currencyType:c.currencyType,
                        cap:c.cap,
                        percentChangeWeek:c.percentChangeWeek,
                        percentChangeDay:c.percentChangeDay
                    }
                );
                return
            };
            await UpdateCurrency(
                {
                    symbol:c.symbol
                }
                ,
                {
                    symbol: c.symbol,
                    name:{
                        en: c.name.en,
                        fa: c.name.fa
                    },
                    price:{
                        usd:c.price.usd,
                    },
                    currencyType:c.currencyType,
                    cap:c.cap,
                    percentChangeWeek:c.percentChangeWeek,
                    percentChangeDay:c.percentChangeDay
                }
            );
        });
    } catch (err:any) {
        console.log("error in get SyncGlobalCrypto : ",err.message);
        throw new Error(err.message);
    }
};