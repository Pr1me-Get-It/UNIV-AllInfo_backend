import express from "express";
import {
  registerUser,
  deleteUser,
  registerKeyword,
  getKeywords,
  deleteKeyword,
  registerSource,
  getSources,
  deleteSource,
} from "../controllers/userController.js";

const userRouter = express.Router();

// /user/register
userRouter.route("/register").post(registerUser).delete(deleteUser);

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
