import { CreateCurrency, FindCurrencyByeSymbol, UpdateCurrency } from "../../db/currency/currency.utils";
import { connectToDB } from "../../db/utils";
import { CurrencyModel } from "../../models/currency.model";

const fetcher = async(url:string) => {
    try {
        const res = await fetch(url);
        if (!res.ok) {
            console.log("fetcher : ",await res.json());
            throw new Error("failed to fetch")
        };
        return res.json();        
    } catch (err:any) {
        throw new Error(err.message);
    }
};

type currencyType = {
    price:number,
    success:boolean,
    time:string,
    high:number,
    low:number
};

const symbolToNames = {
    'irr':{
        en:"iranian rial",
        fa:"ریال ایران"
    },
    'usd':{
        en:"dollar",
        fa:"دلار"
    },
    'euro':{
        en:"euro",
        fa:"یورو"
    },
    'gbp':{
        en:"pound",
        fa:"پوند"
    },
    'gold-miskal':{
        en:"miskal gold",
        fa:"طلا مثقال"
    },
    'coin-emami':{
        en:"emami coin",
        fa:"سکه امامی"
    },
    'coin-baharazadi':{
        en:"baharazadi coin",
        fa:"سکه بهار ازادی"
    },
    'coin-baharazadi-nim':{
        en:"baharazadi half coin",
        fa:"نیم سکه بهار ازادی"
    },
    'coin-baharazadi-rob':{
        en:"baharazadi quarter coin",
        fa:"ربع سکه بهار ازادی"
    },
    'coin-gerami':{
        en:"gerami coin",
        fa:"سکه گرمی"
    }

}

type namesKeysType = keyof typeof symbolToNames;

export const SyncGlobalCurrency = async() => {
    try {
        const currenciesUrl = "https://api.priceto.day/v1/symbols";
        const body = await fetcher(currenciesUrl);
        const currencyNames : any[] = body?.symbols; 
        await connectToDB();
        
        currencyNames.forEach(async(cSymbol:namesKeysType) => {
            if (cSymbol === "irr") return
            const currencyUrl = ` https://api.priceto.day/v1/latest/irr/${cSymbol}`;
            const currency : currencyType = await fetcher(currencyUrl);
            
            const existed = await 
                FindCurrencyByeSymbol(cSymbol.toUpperCase())
                &&
                true
            ;
                
            if (!existed) {
                await CreateCurrency(
                    {
                        symbol: cSymbol.toUpperCase(),
                        name:{
                            en: symbolToNames[cSymbol].en,
                            fa: symbolToNames[cSymbol].fa
                        },
                        time:new Date(currency.time),
                        price:currency.price,
                        currencyType:"currency",
                    }
                );
                return
            };
            await UpdateCurrency(
                {
                    symbol:cSymbol.toUpperCase(),
                }
                ,
                {
                    symbol: cSymbol.toUpperCase(),
                    name:{
                        en: symbolToNames[cSymbol].en,
                        fa: symbolToNames[cSymbol].fa
                    },
                    price:currency.price,
                    currencyType:"currency",
                    time:new Date(currency.time)
                }
            );
            
        });
    } catch (err:any) {
        console.log("error in get SyncGlobalCrypto : ",err.message);
        throw new Error(err.message);
    }
};