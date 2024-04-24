import { Router } from "express";
import { authorizeHandler, loginHandler, logoutHandler, signupHandler } from "../controllers/userController";

const userRouter = Router();

userRouter.post("/signup",signupHandler);
userRouter.post("/login",loginHandler);
userRouter.get("/logout",logoutHandler);
userRouter.get("/checkAuth",authorizeHandler);

export default userRouter