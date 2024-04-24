import { configDotenv } from "dotenv";

configDotenv()

import express from "express";
import cookieParser from "cookie-parser";
import userRouter from "./routers/user.router";

const port = process.env.PORT || 8000;

const app = express();

app.use(cookieParser());
app.use(express.json());

app.use("/user",userRouter);

app.listen(port, () => console.log("server in running on port %d",port));