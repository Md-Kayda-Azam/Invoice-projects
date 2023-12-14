import express from "express";
import {
  createInvoice,
  deleteInvoice,
  getAllInvoices,
  getSingleInvoice,
  updateInvoice,
} from "../controllers/invoiceController.js";
import tokenVerify from "../middlewares/verifyToken.js";

const router = express.Router();

// Use verify token middleware
router.use(tokenVerify);

// Create routes
router.route("/").get(getAllInvoices).post(createInvoice);
router.route("/:id").get(getSingleInvoice).delete(deleteInvoice).put(updateInvoice);

// Export the router
export default router;
