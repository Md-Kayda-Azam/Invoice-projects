import express from "express";
import {
  signin,
  signout,
  signup,
  loggedInUser,
} from "../controllers/authController.js";
import tokenVerify from "../middlewares/verifyToken.js";

const router = express.Router();

// create route
router.route("/signin").post(signin);
router.route("/signout").post(signout);
router.route("/signup").post(signup);

router.get("/me", tokenVerify, loggedInUser);

// export default router
export default router;
