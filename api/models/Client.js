import mongoose from "mongoose";

const clientSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
        },
        email: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        mobile: {
            type: String,
            required: true,
            unique: true,
            trim: true,
        },
        address: {
            street: String,
            city: String,
            state: String,
            zipCode: String,
        },
        country: {
            type: String,
            trim: true,
        },
        users: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "User",
            },
        ],
        trash: {
            type: Boolean,
            default: false,
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model("Client", clientSchema);