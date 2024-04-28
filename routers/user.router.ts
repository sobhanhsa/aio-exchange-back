import { Router } from "express";
import { addFavoriteHandler, authorizeHandler, deleteFavoriteHandler, findFavoriteHandler, loginHandler, logoutHandler, signupHandler } from "../controllers/user.controller";
import protectRoute from "../middlewares/auth.middleware";

const userRouter = Router();

userRouter.post("/signup",signupHandler);
userRouter.post("/login",loginHandler);
userRouter.get("/logout",logoutHandler);
userRouter.get("/checkAuth",authorizeHandler);

userRouter.patch("/favorites",protectRoute,addFavoriteHandler);
userRouter.delete("/favorites",protectRoute,deleteFavoriteHandler);
userRouter.get("/favorites",protectRoute,findFavoriteHandler);

export default userRouter