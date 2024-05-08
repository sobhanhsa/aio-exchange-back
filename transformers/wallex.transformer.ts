import { CurrencyDtoType } from "../models/currency.model";

const fetcher = async(url:string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("failed to fetch");
    };
    return res.json();        
};

// {
//     symbol: c.key,
//     name:{
//         en: c.name_en,
//         fa: c.name
//     },
//     price:{
//         usd:c.price,
//     },
//     currencyType:"crypto",
//     cap:c.market_cap,
//     percentChangeWeek:c.percent_change_7d,
//     percentChangeDay:c.percent_change_24h
// }

type currency = {
    key:string,
    name_en:string,
    name:string,
    //dollar baseds
    price:number,
    market_cap:number,
    percent_change_7d:number,
    percent_change_24h:number
}

export async function wallexTransformer():Promise<CurrencyDtoType[]> {
    //get the symbols 
    const body = await fetcher("https://api.wallex.ir/v1/currencies/stats");

    const coins : currency[] = body.result;

    const currencies : CurrencyDtoType[] = [];

    coins.forEach((c) => {
        currencies.push({
            symbol:c.key,
            name:{
                en: c.name_en,
                fa: c.name
            },
            price:{
                usd:c.price,
            },
            currencyType:"crypto",
            cap:c.market_cap,
            percentChangeWeek:c.percent_change_7d,
            percentChangeDay:c.percent_change_24h
        })
    });

    //return symbol
    return currencies
}

