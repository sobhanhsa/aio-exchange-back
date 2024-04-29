import { configDotenv } from "dotenv";

configDotenv()

import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";
import { SyncGlobalCrypto } from "./providers/currency/cryptoCurrency.provider";
import { SyncGlobalCurrency } from "./providers/currency/currency.provider";
import currencyRouter from "./routers/currency.router";
import { SyncGlobalCryptoHistory } from "./providers/currency/history/cryptoCurrencyHistory.provider";

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);
app.use("/currency",currencyRouter);

app.listen(port, async() => {
    console.log("server in running on port %d",port)

    SyncGlobalCryptoHistory();

    setInterval(async() => {
        try {
            console.log("onappListen : syncing prices ...");
            await SyncGlobalCurrency();
            await SyncGlobalCrypto();
        }  catch (err:any) {
            console.log("error in onappListen : ",err.message);
        }
    },5*60*1000);
});