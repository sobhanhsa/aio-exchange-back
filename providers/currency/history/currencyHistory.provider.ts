import { CreateCurrency, UpdateCurrency } from "../../../db/currency/currency.utils";
import { connectToDB } from "../../../db/utils";
import { CurrencyModel, CurrencyType } from "../../../models/currency.model";

const fetcher = async(url:string) => {
    const res = await fetch(url);
    if (!res.ok) throw new Error("failed to fetch");
    return res.json();
};

const delayMaker = (time:number) => new Promise(resolve => setTimeout(resolve, time));

export const SyncGlobalCurrencyHistory = async(period:number) => {
    try {
        await connectToDB();

        const currencies : CurrencyType[] = await CurrencyModel.find({
            currencyType:"currency"
        });
        
        const troubledCs: string[] = [];
        
        let today = new Date();
        
        const from = new Date(new Date().setDate(today.getDate()-period));
        from.setUTCHours(0,0,0,0);
        
        // console.log("today : ",today);


        for (let c of currencies) {
            // console.log("c : ",c);

            const cUrl = `
            https://api.priceto.day/v1/history/irr/${c.symbol}?from=${from.toISOString()}&to${today.toISOString()}
            `

            const historyBody = await fetcher(cUrl);
            
            // console.log("res: ",historyBody);
            
            const history : {price:number,time:string}[] = historyBody.result;
            

            if (history.length === 0) continue
            
            if (c.history != undefined && c.history != null && c.history.length !== 0) {
                if (
                    c.history[0]?.time?.getMilliseconds() 
                    >
                    new Date(history[history.length-1].time).getMilliseconds()
                ) {
                    continue
                }
            }


            if (c.time && c.priceIrr && history.length !== 0) {
                if (
                    new Date(c.time.setUTCHours(23,59,59,999)) > new Date(history[history.length-1].time)
                ) {
                    console.log("is true ?")
                    history.push({price:c?.priceIrr,time:new Date().toISOString()});
                }
            }

            console.log("history : ",history);

            await CurrencyModel.updateOne({
                _id:c._id
            },{
                $push:{
                    history:{
                        $each:[...(
                                (history.map(
                                    h => ({time:new Date(h.time),price:h.price})
                                )).reverse()
                            )                                
                        ],
                        $position:0
                    }
                }
            });


            await delayMaker(100);
        }

    
    } catch (err:any) {
        console.error("error in get currencyHistory.provider : ",err.message);
        // throw new Error(err.message);
    }
};