import { Router } from "express";
import { authorizeHandler, loginHandler, logoutHandler, signupHandler } from "../controllers/user.controller";
import { getAllCurrencylHandler, getByeSymbolHandler } from "../controllers/currency.controller";

const currencyRouter = Router();


currencyRouter.get("/:symbol",getByeSymbolHandler);
currencyRouter.get("/",getAllCurrencylHandler);

export default currencyRouter