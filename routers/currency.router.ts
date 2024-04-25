import { Router } from "express";
import { authorizeHandler, loginHandler, logoutHandler, signupHandler } from "../controllers/user.controller";
import { getByeSymbolHandler } from "../controllers/currency.controller";

const currencyRouter = Router();


currencyRouter.get("/:symbol",getByeSymbolHandler);

export default currencyRouter