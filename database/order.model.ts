import { models, model, Schema, Document, Types } from "mongoose";

export interface IOrder {
  user: Types.ObjectId;
  items: string[];
  total: number;
  paymentMethod: "bank_transfer" | "momo";
  status: "pending" | "completed" | "cancelled";
  transactionId?: string;
}

export interface IOrderDocument extends IOrder, Document {}

const OrderSchema = new Schema<IOrder>(
  {
    user: { type: Schema.Types.ObjectId, required: true },
    items: { type: [String], required: true },
    total: { type: Number, required: true },
    paymentMethod: {
      type: String,
      enum: ["bank_transfer", "momo"],
      required: true,
    },
    status: {
      type: String,
      enum: ["pending", "completed", "cancelled"],
      default: "pending",
      required: true,
    },
    transactionId: { type: String },
  },
  {
    timestamps: true,
  }
);

const Order = models?.Order || model<IOrder>("Order", OrderSchema);
export default Order;
