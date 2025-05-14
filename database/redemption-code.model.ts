import { models, model, Schema, Document, Types } from "mongoose";

export interface IRedemptionCode {
  code: string;                 // 10-character alphanumeric code
  isActive: boolean;            // Whether the code is active or not
  isRedeemed: boolean;          // Whether the code has been redeemed
  redeemedBy?: Types.ObjectId;  // User who redeemed the code
  redeemedAt?: Date;            // When the code was redeemed
  createdBy: Types.ObjectId;    // Admin who created the code
  expiresAt?: Date;             // Optional expiration date
  // No specific monetary value - codes just grant access
}

export interface IRedemptionCodeDocument extends IRedemptionCode, Document {}

const RedemptionCodeSchema = new Schema<IRedemptionCode>(
  {
    code: { 
      type: String, 
      required: true, 
      unique: true,
      match: /^[A-Z0-9]{10}$/ // Ensure 10-character alphanumeric format
    },
    isActive: { 
      type: Boolean, 
      default: true, 
      required: true 
    },
    isRedeemed: { 
      type: Boolean, 
      default: false, 
      required: true 
    },
    redeemedBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User" 
    },
    redeemedAt: { 
      type: Date 
    },
    createdBy: { 
      type: Schema.Types.ObjectId, 
      ref: "User", 
      required: true 
    },
    expiresAt: { 
      type: Date 
    },
    // Code doesn't have a specific value - it just grants access once
  },
  {
    timestamps: true,
  }
);

const RedemptionCode = models?.RedemptionCode || model<IRedemptionCode>("RedemptionCode", RedemptionCodeSchema);
export default RedemptionCode;
