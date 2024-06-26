import { CreateCurrency, FindCurrencyByeSymbol, UpdateCurrency } from "../../db/currency/currency.utils";
import { connectToDB } from "../../db/utils";
import { CurrencyModel } from "../../models/currency.model";

const delayMaker = (time:number) => new Promise(resolve => setTimeout(resolve, time));

const fetcher = async(url:string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("failed to fetch");
    };
    return res.json();        
};

type currencyType = {
    price:number,
    success:boolean,
    time:string,
    high:number,
    low:number
};

// dolar price according to irr
let dollarPrice : number | undefined;

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
        const currencyNames : namesKeysType[] = body?.symbols; 
                
        if (!currencyNames) {
            return
        }
        
        await connectToDB();


        for (let cSymbol of currencyNames) {
            if (cSymbol === "irr") continue
            const currencyUrl = ` https://api.priceto.day/v1/latest/irr/${cSymbol}`;
            const currency : currencyType = await fetcher(currencyUrl);
            
            // price is irr based

            if (cSymbol==="usd") {
                dollarPrice = currency.price;
            }

            const existed = await 
            FindCurrencyByeSymbol(cSymbol.toUpperCase())
            &&
            true
            ;
            
            if (!dollarPrice) {
                throw new Error("dollar price is required !")
            }

            if (!existed) {
                await CreateCurrency(
                    {
                        symbol: cSymbol.toUpperCase(),
                        name:{
                            en: symbolToNames[cSymbol].en,
                            fa: symbolToNames[cSymbol].fa
                        },
                        time:new Date(currency.time),
                        currencyType:"currency",
                        price:{
                            usd:currency.price/dollarPrice,
                            irr:currency.price
                        },
                    }
                );
                continue
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
                    time:new Date(currency.time),
                    currencyType:"currency",
                    price:{
                        usd:currency.price/dollarPrice,
                        irr:currency.price
                    },
                }
            );
            
            await delayMaker(100);
        }     
    }   
    catch (err:any) {
        console.error("error SyncGlobalCurrency : ",err.message);
        throw new Error(err.message);
    }
};