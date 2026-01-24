import express from "express";
import {
  registerUser,
  registerKeyword,
  getKeywords,
  deleteKeyword,
} from "../controllers/userController.js";

const userRouter = express.Router();

// /user/register
userRouter.post("/register", registerUser);

// /user/keyword
userRouter
  .route("/keyword")
  .get(getKeywords)
  .post(registerKeyword)
  .delete(deleteKeyword);

export default userRouter;
