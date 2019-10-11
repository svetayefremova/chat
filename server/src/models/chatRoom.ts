import mongoose, { Document, Schema } from "mongoose";
import { IMessage } from "./message";

export interface IChatRoom extends Document {
  messages: [IMessage];
  name: string;
  members: [string];
  createdAt: number;
  updatedAt: number;
}

const charRoomSchema: Schema = new Schema({
  name: { type: String },
  messages: [{ type: mongoose.Schema.Types.ObjectId, ref: "Message" }],
  members: [{ type: String }],
  createdAt: { type: Number },
  updatedAt: { type: Number }
});

charRoomSchema.set("toObject", { getters: true, virtuals: true });

export default mongoose.model<IChatRoom>("ChatRoom", charRoomSchema);