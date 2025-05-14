import { models, model, Schema, Document, Types } from "mongoose";

export interface IPayment {
  user: Types.ObjectId;
  amount: number;
  status: "pending" | "completed" | "failed";
  method: "bank_transfer" | "momo" | "physical_code";
  transactionId?: string;
  notes?: string;
  // Thời gian hết hạn (nếu muốn triển khai subscription dạng định kỳ sau này)
  expiresAt?: Date;
}

export interface IPaymentDocument extends IPayment, Document {}

const PaymentSchema = new Schema<IPayment>(
  {
    user: { type: Schema.Types.ObjectId, ref: "User", required: true },
    amount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "completed", "failed"],
      default: "pending",
      required: true,
    },
    method: {
      type: String,
      enum: ["bank_transfer", "momo", "physical_code"],
      required: true,
    },
    transactionId: { type: String },
    notes: { type: String },
    expiresAt: { type: Date },
  },
  {
    timestamps: true,
  }
);

const Payment = models?.Payment || model<IPayment>("Payment", PaymentSchema);
export default Payment;
