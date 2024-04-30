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

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);
app.use("/currency",currencyRouter);

app.listen(port, async() => {
    console.log("server in running on port %d",port)

    setAsyncInterval(async() => {
        try {
            
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
            await SyncGlobalCrypto();
        }  catch (err:any) {
            console.log(
                "error onappListen sync-price interval: ",
                err.message
            );
        }
    },1000*60*5);
});