import { CurrencyDtoType } from "../models/currency.model";

const fetcher = async(url:string) => {
    const res = await fetch(url);
    if (!res.ok) {
        throw new Error("failed to fetch");
    };
    return res.json();        
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

type currencyType = {
    //irr based
    price:number,
    success:boolean,
    time:string,
    high:number,
    low:number
};

type namesKeysType = keyof typeof symbolToNames;

const usdPrice = 60000;

export async function priceToTransformer():Promise<CurrencyDtoType[]> {
    if (!usdPrice) {
        throw new Error("usd price required !");
    }

    //get the symbols 
    const body = await fetcher("https://api.priceto.day/v1/symbols");

    const symbols :namesKeysType[] = body?.symbols;

    const currencies : CurrencyDtoType[] = [];

    //get the symbol price
    symbols.forEach(async(s) => {
        if (s === "irr" || s === "usd") return
        const currencyUrl = ` https://api.priceto.day/v1/latest/irr/${s}`;
        //price is irr based
        const currency : currencyType = await fetcher(currencyUrl);
        currencies.push({
            symbol: s as string,
            name: {
                en: symbolToNames[s].en,
                fa: symbolToNames[s].fa,
            },
            price: {
                usd: currency.price/usdPrice,
                irr: currency.price,
            },
            currencyType: "currency"
        });
    });

    //return symbol
    return currencies
}

