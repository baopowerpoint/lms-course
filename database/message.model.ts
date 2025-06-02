import { Schema, Document, Model, models, model } from "mongoose";

export interface IMessage extends Document {
  content: string;
  senderId: string;
  receiverId: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema(
  {
    content: {
      type: String,
      required: true,
    },
    senderId: {
      type: String,
      required: true,
    },
    receiverId: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// Create index for faster queries
MessageSchema.index({ senderId: 1, receiverId: 1 });

// Check if model already exists to prevent OverwriteModelError during hot reloads
const Message = (models?.Message ||
  model<IMessage>("Message", MessageSchema)) as Model<IMessage>;

export default Message;
