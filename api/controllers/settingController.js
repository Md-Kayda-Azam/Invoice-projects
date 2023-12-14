import asyncHandler from "express-async-handler";
import Client from "../models/Client.js";
import Setting from "../models/Setting.js";

/**
 * @DESC Get all settings
 * @ROUTE /api/v1/setting
 * @method GET
 * @access public
 */
export const getAllSettings = asyncHandler(async (req, res) => {
    const settings = await Setting.find();

    if (settings.length === 0) {
        return res.status(404).json({ message: "Settings data not found" });
    }

    res.status(200).json(settings);
});


/**
 * @DESC Get Single setting
 * @ROUTE /api/v1/setting/:id
 * @method GET
 * @access public
 */
export const getSingleSetting = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const setting = await Setting.findById(id);

    if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json(setting);
});


/**
 * @DESC Create new Setting
 * @ROUTE /api/v1/setting
 * @method POST
 * @access public
 */
export const createSetting = asyncHandler(async (req, res) => {
    // Extract values from request body
    const { logo, favicon, title, trash } = req.body;

    // Validate required fields
    if (!logo || !favicon || !title) {
        return res.status(400).json({ message: "Logo, favicon, and title are required" });
    }

    // Create new setting
    const setting = await Setting.create({
        logo,
        favicon,
        title,
        trash,
    });

    res.status(200).json({ setting, message: "Setting created successfully" });
});


/**
 * @DESC Delete Setting
 * @ROUTE /api/v1/setting/:id
 * @method DELETE
 * @access public
 */
export const deleteSetting = asyncHandler(async (req, res) => {
    const { id } = req.params;

    const setting = await Setting.findByIdAndDelete(id);

    if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json(setting);
});


/**
 * @DESC Update Setting
 * @ROUTE /api/v1/setting/:id
 * @method PUT/PATCH
 * @access public
 */
export const updateSetting = asyncHandler(async (req, res) => {

    const { id } = req.params;

    const updatedSetting = req.body;

    const setting = await Setting.findByIdAndUpdate(id, updatedSetting, { new: true });

    if (!setting) {
        return res.status(404).json({ message: "Setting not found" });
    }

    res.status(200).json(setting);
});

/**
 * @DESC Update Setting
 * @ROUTE /api/v1/setting/:id
 * @method PUT/PATCH
 * @access public
 */
export const imageDeleteCloudinary = asyncHandler(async (req, res) => {

    const publicId = req.body.publicId;
    const result = await cloudinary.uploader.destroy(publicId);


    res.status(200).json(result, "delete success image");
});
