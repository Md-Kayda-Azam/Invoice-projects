import express from "express";
import {
    createClient,
    deleteClient,
    getAllClients,
    getSingleClient,
    updateClient,
} from "../controllers/clientController.js";
import tokenVerify from "../middlewares/verifyToken.js";

const router = express.Router();

// Use verify token middleware
router.use(tokenVerify);

// Create routes
router.route("/").get(getAllClients).post(createClient);
router.route("/:id").get(getSingleClient).delete(deleteClient).put(updateClient);

// Export the router
export default router;
