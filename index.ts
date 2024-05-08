import { configDotenv } from "dotenv";

configDotenv()

import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";
import { SyncGlobalCrypto } from "./providers/currency/cryptoCurrency.provider";
import { SyncGlobalCurrency } from "./providers/currency/currency.provider";
import currencyRouter from "./routers/currency.router";
import { SyncGlobalCryptoHistory } from "./providers/currency/history/cryptoCurrencyHistory.provider";
import { setAsyncInterval } from "./utils/asyncInterval.utils";
import { SyncGlobalCurrencyHistory } from "./providers/currency/history/currencyHistory.provider";
import { CurrencyModel } from "./models/currency.model";
import cors from "cors";

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

const corsOptions = {
    credentials:true,
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}

app.use(cors(corsOptions));


app.use("/user",userRouter);
app.use("/currency",currencyRouter);

app.listen(port, async() => {
    console.log("server in running on port %d",port)

    setAsyncInterval(async() => {
        try {
            
            await SyncGlobalCurrencyHistory(1);
            await SyncGlobalCryptoHistory(1);
        }  catch (err:any) {
            console.log(
                "error in onappListen sync crypto history interval : "
                ,err.message
                );
            }
        },1000*60*60*24)
    

    const intervalIndex = setAsyncInterval(async() => {
        try {
            console.log("onappListen : syncing prices ...");
            await SyncGlobalCurrency();
            // await SyncGlobalCrypto();
        }  catch (err:any) {
            console.log(
                "error onappListen sync-price interval: ",
                err.message
            );
        }
    },1000);
});