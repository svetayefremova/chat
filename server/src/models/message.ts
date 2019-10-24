import mongoose, { Document, Schema } from "mongoose";
import { IUser } from "./user";

export interface IMessage extends Document {
  author: IUser;
  authorId: string;
  content: string;
  chatRoomId: string;
  status: string;
  isRead: boolean;
  createdAt: number;
  updatedAt: number;
}

const messageSchema: Schema = new Schema({
  authorId: { type: String },
  author: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  content: { type: String },
  chatRoomId: { type: String },
  status: { type: String },
  isRead: { type: Boolean },
  createdAt: { type: Number },
  updatedAt: { type: Number }
});

messageSchema.set("toObject", { getters: true, virtuals: true });

export default mongoose.model<IMessage>("Message", messageSchema);