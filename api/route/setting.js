import express from "express";

import tokenVerify from "../middlewares/verifyToken.js";
import { createSetting, deleteSetting, getAllSettings, getSingleSetting, updateSetting, imageDeleteCloudinary } from "../controllers/settingController.js";

const router = express.Router();

router.route("/idc").post(imageDeleteCloudinary)
// Use verify token middleware
router.use(tokenVerify);

// Create routes
router.route("/").get(getAllSettings).post(createSetting);
router.route("/:id").get(getSingleSetting).delete(deleteSetting).put(updateSetting);

// Export the router
export default router;
