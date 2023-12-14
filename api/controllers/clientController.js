import asyncHandler from "express-async-handler";
import Client from "../models/Client.js";

/**
 * @DESC Get all clients
 * @ROUTE /api/v1/clients
 * @method GET
 * @access public
 */
export const getAllClients = asyncHandler(async (req, res) => {
    const clients = await Client.find();

    const userId = req.me._id
    const userClientss = clients.filter((data) => data.users.toString() === userId.toString());


    if (userClientss.length === 0) {
        return res.status(404).json({ message: "Client data not found" });
    }

    res.status(200).json(userClientss);
});

/**
 * @DESC Get Single client
 * @ROUTE /api/v1/clients/:id
 * @method GET
 * @access public
 */
export const getSingleClient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const client = await Client.findById(id);

    if (!client) {
        return res.status(404).json({ message: "Client not found" });
    }

    res.status(200).json(client);
});

/**
 * @DESC Create new Client
 * @ROUTE /api/v1/clients
 * @method POST
 * @access public
 */
export const createClient = asyncHandler(async (req, res) => {
    console.log(req.body);

    // Extract values from request body
    const { name, email, mobile, address, country } = req.body;

    // Validate required fields
    if (!name || !email || !mobile) {
        return res.status(400).json({ message: "Name, email, and mobile are required" });
    }

    // Create new client
    const client = await Client.create({
        name,
        email,
        mobile,
        address,
        country,
    });

    res.status(200).json({ client, message: "Client created successfully" });
});

/**
 * @DESC Delete Client
 * @ROUTE /api/v1/clients/:id
 * @method DELETE
 * @access public
 */
export const deleteClient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const client = await Client.findByIdAndDelete(id);

    res.status(200).json(client);
});

/**
 * @DESC Update Client
 * @ROUTE /api/v1/clients/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateClient = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const updatedClient = req.body;

    const client = await Client.findByIdAndUpdate(id, updatedClient, { new: true });

    res.status(200).json(client);
});
