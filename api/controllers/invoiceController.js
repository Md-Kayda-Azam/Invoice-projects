import asyncHandler from "express-async-handler";
import Invoice from "../models/Invoice.js";
import Client from "../models/Client.js";

/**
 * @DESC Get all invoices
 * @ROUTE /api/v1/invoices
 * @method GET
 * @access public
 */
export const getAllInvoices = asyncHandler(async (req, res) => {
    const invoices = await Invoice.find();

    const userId = req.me._id

    const userInvoices = invoices.filter((data) => data.users.toString() === userId.toString());


    if (userInvoices.length === 0) {
        return res.status(404).json({ message: "User invoices not found" });
    }

    res.status(200).json(userInvoices);
});

/**
 * @DESC Get Single invoice
 * @ROUTE /api/v1/invoices/:id
 * @method GET
 * @access public
 */
export const getSingleInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const invoice = await Invoice.findById(id);

    if (!invoice) {
        return res.status(404).json({ message: "Invoice not found" });
    }

    res.status(200).json(invoice);
});

/**
 * @DESC Create new Invoice
 * @ROUTE /api/v1/invoices
 * @method POST
 * @access public
 */
export const createInvoice = asyncHandler(async (req, res) => {

    // Extract values from request body
    const { invoiceNumber, client, billBy, services, totalAmount, amountPaid, dueBalance, dateDue, dateIssue, paymentStatus, notes } = req.body;

    // Validate required fields
    if (!invoiceNumber || !client || !billBy || !totalAmount || !dateDue || !amountPaid || !dateIssue || !paymentStatus) {
        return res.status(400).json({ message: "All fields are required" });
    }

    const checkclient = await Client.findOne({ email: client.email })

    if (!checkclient) {
        client.users = req.me._id
        await Client.create(client)
    }
    const userId = req.me._id
    // Create new invoice
    const invoice = await Invoice.create({
        invoiceNumber,
        client,
        billBy,
        users: userId,
        services,
        totalAmount,
        amountPaid,
        dueBalance,
        dateDue,
        dateIssue,
        paymentStatus,
        notes,
    });
    console.log(invoice);

    res.status(200).json({ invoice, message: "Invoice created successfully" });
});

/**
 * @DESC Delete Invoice
 * @ROUTE /api/v1/invoices/:id
 * @method DELETE
 * @access public
 */
export const deleteInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const invoice = await Invoice.findByIdAndDelete(id);

    res.status(200).json(invoice);
});

/**
 * @DESC Update Invoice
 * @ROUTE /api/v1/invoices/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateInvoice = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updatedInvoice = req.body;

    const invoice = await Invoice.findByIdAndUpdate(id, updatedInvoice, { new: true });

    res.status(200).json(invoice);
});
