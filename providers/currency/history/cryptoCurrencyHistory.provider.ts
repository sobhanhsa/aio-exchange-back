import { CreateCurrency, UpdateCurrency } from "../../../db/currency/currency.utils";
import { connectToDB } from "../../../db/utils";
import { CurrencyModel, CurrencyType } from "../../../models/currency.model";

const fetcher = async(url:string) => {
    try{
        const apiKey = "50c8675ae447c796fa56f2c6eb194e453af48dbf611cc1f91eb32ea49f8ee687";
        const res = await fetch(url+"&api_key="+apiKey);
        if (!res.ok) throw new Error("failed to fetch");
        return res.json();
    } catch(error:any) {
        console.log("SyncGlobalCryptoHistory.fetcher : ",error);
        // throw new Error(error.message);
    }
};

const delayMaker = (time:number) => new Promise(resolve => setTimeout(resolve, time));

export const SyncGlobalCryptoHistory = async(period:number) => {
    try {
        await connectToDB();
        const currencies : CurrencyType[] = await CurrencyModel.find({
            currencyType:"crypto"
        });
        
        
        // await CurrencyModel.updateMany({currencyType:"crypto"},{
        //     history:[]
        // });


        const {Data:exchanges}:{Data:any[]} = await fetcher("https://min-api.cryptocompare.com/data/top/exchanges?fsym=BTC&tsym=USD&limit=100");
        
        // console.log("SyncGlobalCryptoHistory currencies : ",currencies);
        (async() => {
            const troubledCs: string[] = [  ];
            
            for (let c of currencies) {
                const historyBody = await fetcher(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${c.symbol}&tsym=USD&limit=${period}`);

                if (historyBody?.Response !== "Success") {
                    // const newHistory = await fetcher(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${c.symbol}&tsym=USD&limit=7&e=coinbase`);
                    // if (newHistory?.Response !== "Success") {
                        // };
                    troubledCs.push(c.symbol)
                    await delayMaker(75)
                    continue
                }

                const history : {close:number,time:number}[] = historyBody.Data.Data;



                if (c.history != undefined || c.history != null) {
                    if (
                        c.history[0].time?.getMilliseconds() 
                        >
                        history[history.length-1].time * 1000
                    ) {
                        continue
                    }
                }

                await CurrencyModel.updateOne({
                    _id:c._id
                },{
                    $push:{
                        history:{
                            $each:[...((history
                                .map(h => ({time:new Date(Number(h.time)*1000),price:h.close}))).reverse())
                            ],
                            $position:0
                        }
                    }
                });


                await delayMaker(75);
            }

            return

            console.log("second step");

            console.log("before re research : ",troubledCs);

            
            await delayMaker(1000);
            
            //get top exchanges symbol
            //search for history of unmatched coins bye them
            
            loopEx : 
            for (let exchange of exchanges) {
                console.log("exchange : ",exchange);
                for (let symbol of troubledCs) {    
                    const history = await fetcher(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${symbol}&tsym=USD&limit=7&e=${exchange.exchange}`);
                    
                    if (history?.Response === "Success") {
                        console.log("success!!!")                            
                        // const newHistory = await fetcher(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${c.symbol}&tsym=USD&limit=7&e=coinbase`);
                        // if (newHistory?.Response !== "Success") {
                            // };
                            const i = troubledCs.indexOf(symbol);
                            
                            troubledCs.splice(i,1);
                            
                        }
    
                        if (troubledCs.length === 0) {
                            break loopEx;
                        }
                        
                        console.log("SyncGlobalCryptoHistory : ",history);
                        
                        await delayMaker(55);
                    }
                    
                    await delayMaker(75);
                } 
                
            console.log("exchanges num : ",exchanges.length);
            console.log("troubledCs : ",troubledCs);
            
        })()
        
        
        return
        
        currencies.forEach(async(c) => {
            // const history = await fetcher(`https://min-api.cryptocompare.com/data/v2/histoday?fsym=${c.symbol}&tsym=USD&limit=7`);

            // console.log("SyncGlobalCryptoHistory : ",history);

            // await UpdateCurrency(
            //     {
            //         symbol:c.key
            //     }
            //     ,
            //     {
                    
            //     }
            // );
            await delayMaker(1000);
        });
    } catch (err:any) {
        console.log("error in get cryptoCurrencyHistory.provider : ",err.message);
        throw new Error(err.message);
    }
};