import { configDotenv } from "dotenv";

configDotenv()

import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";
import { SyncGlobalCrypto } from "./providers/currency/cryptoCurrency.provider";
import { SyncGlobalCurrency } from "./providers/currency/currency.provider";
import currencyRouter from "./routers/currency.router";

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);
app.use("/currency",currencyRouter);

app.listen(port, async() => {
    console.log("server in running on port %d",port)
    try {
        setInterval(() => {
            console.log("onappListen : syncing prices ...");
            SyncGlobalCurrency();
            SyncGlobalCrypto();
        },5*60*1000);
    } catch (err:any) {
        console.log("error in onListen : ",err.message);
    }
});