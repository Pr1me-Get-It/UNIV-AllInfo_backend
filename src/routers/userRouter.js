import express from "express";
import {
  registerUser,
  registerKeyword,
  getKeywords,
  deleteKeyword,
  registerSource,
  getSources,
  deleteSource,
  certifyUser,
} from "../controllers/userController.js";
import uploadMiddleware from "../config/multer.js";

const userRouter = express.Router();

// /user/register
userRouter.post("/register", registerUser);

// /user/certify
userRouter.post("/certify", uploadMiddleware, certifyUser);

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
