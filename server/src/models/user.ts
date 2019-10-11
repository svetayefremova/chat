import mongoose, { Schema, Document } from 'mongoose'
import { IChatRoom } from './chatRoom';

export interface IUser extends Document {
  username: string
  chatRooms: [IChatRoom]
  createdAt: number
  updatedAt: number
}

const userSchema: Schema = new Schema({
  username: { type: String, unique: true, trim: true, required: true },
  chatRooms: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ChatRoom' }],
  createdAt: { type: Number },
  updatedAt: { type: Number }
})

userSchema.set('toObject', { getters: true, virtuals: true })

export default mongoose.model<IUser>('User', userSchema)