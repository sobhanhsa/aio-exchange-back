import { CreateCurrency, UpdateCurrency } from "../../db/currency/currency.utils";
import { connectToDB } from "../../db/utils";
import { CurrencyModel } from "../../models/currency.model";

const fetcher = async() => {
    const res = await fetch("https://api.wallex.ir/v1/currencies/stats");
    if (!res.ok) {
        console.log("cryptoCurrency provider fetcher : ",res);
        throw new Error("failed to fetch")
    };
    return res.json();
};

export const SyncGlobalCrypto = async() => {
    try {
        const body = await fetcher();
        const currencies : any[] = body.result; 
        await connectToDB();
        currencies.forEach(async(c) => {
            //POST or UPDATE each currency
            const existed = await CurrencyModel.exists({
                symbol:c.key
            });
            if (!existed) {
                await CreateCurrency(
                    {
                        symbol: c.key,
                        name:{
                            en: c.name_en,
                            fa: c.name
                        },
                        price:c.price,
                        currencyType:"crypto",
                        cap:c.market_cap,
                        percentChangeWeek:c.percent_change_7d,
                        percentChangeDay:c.percent_change_24h
                    }
                );
                return
            };
            await UpdateCurrency(
                {
                    symbol:c.key
                }
                ,
                {
                    symbol: c.key,
                    name:{
                        en: c.name_en,
                        fa: c.name
                    },
                    price:c.price,
                    currencyType:"crypto",
                    cap:c.market_cap,
                    time:new Date,
                    percentChangeWeek:c.percent_change_7d,
                    percentChangeDay:c.percent_change_24h
                }
            );
        });
    } catch (err:any) {
        console.log("error in get SyncGlobalCrypto : ",err.message);
        throw new Error(err.message);
    }
};