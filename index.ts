import { configDotenv } from "dotenv";

configDotenv()

import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";
import { SyncGlobalCrypto } from "./providers/currency/cryptoCurrency.provider";
import currencyRouter from "./routers/currency.router";

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);
app.use("/currency",currencyRouter);

app.listen(port, () => {
    console.log("server in running on port %d",port)
    try {
        SyncGlobalCrypto();
    } catch (err:any) {
        console.log("error in on listen : ",err.message);
    }
});