import { CreateCurrency, UpdateCurrency } from "../../db/currency/utils";
import { CurrencyModel } from "../../models/currencyModel";

const fetcher = async() => {
    const res = await fetch("https://api.wallex.ir/v1/currencies/stats");
    if (!res.ok) throw new Error("failed to fetch");
    return res.json();
};

export const SyncGlobalCrypto = async() => {
    try {
        const body = await fetcher();
        const currencies : any[] = body.result; 
        currencies.forEach(async(c) => {
            //POST or UPDATE each currency
            const existed = await CurrencyModel.exists({
                symbol:c.key
            });
            if (!existed) {
                await CreateCurrency(
                    c.key,
                    c.name_en,
                    c.name,
                    c.price,
                    c.market_cap,
                    c.percent_change_7d,
                    c.percent_change_24h
                );
                return
            };
            await UpdateCurrency(
                c.key,
                c.name_en,
                c.name,
                c.price,
                c.market_cap,
                c.percent_change_7d,
                c.percent_change_24h
            );
        });
    } catch (err:any) {
        console.log("error in get SyncGlobalCrypto : ",err.message);
        throw new Error(err.message);
    }
};