import mongoose from "mongoose";

const invoiceSchema = mongoose.Schema(
  {
    invoiceNumber: {
      type: String,
      required: true,
      unique: true,
    },
    client: {
      type: Object,
      default: null
    },
    billBy: {
      type: Object,
      default: null
    },
    services: [
      {
        serviceName: {
          type: String,
          required: true,
        },
        quantity: {
          type: Number,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        amount: {
          type: Number,
          required: true,
        },
        description: String,
      },
    ],
    totalAmount: {
      type: Number,
      required: true,
    }, amountPaid: {
      type: Number,
      required: true,
    }, dueBalance: {
      type: Number,
      default: null,
    },
    paymentStatus: {
      type: String,
      enum: ['Pending', 'Unpaid', 'Paid'],
      default: 'Pending',
    },
    users:
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    dateIssue: {
      type: Date,
      required: true,
    },
    dateDue: {
      type: Date,
      required: true,
    },
    notes: String,
    trash: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Invoice", invoiceSchema);
