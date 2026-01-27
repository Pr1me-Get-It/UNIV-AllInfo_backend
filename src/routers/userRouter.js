import express from "express";
import {
  registerUser,
  registerKeyword,
  getKeywords,
  deleteKeyword,
  registerSource,
  getSources,
  deleteSource,
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

// /user/source
userRouter
  .route("/source")
  .get(getSources)
  .post(registerSource)
  .delete(deleteSource);

export default userRouter;
