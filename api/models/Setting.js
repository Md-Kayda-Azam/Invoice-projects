import mongoose from "mongoose";

const settingSchema = mongoose.Schema(
    {
        logo: {
            type: String,
            required: true,
        },
        favicon: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        trash: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Setting", settingSchema);