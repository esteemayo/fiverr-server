import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversation: {
      type: mongoose.Types.ObjectId,
      ref: 'Conversation',
      required: [true, 'A message must have a conversation id'],
    },
    user: {
      type: mongoose.Types.ObjectId,
      ref: 'User',
      required: [true, 'A message must have a user id'],
    },
    desc: {
      type: String,
      required: [true, 'A message must have a description'],
    },
  },
  {
    timestamps: true,
  },
);

const Message =
  mongoose.models.Message || mongoose.model('message', messageSchema);

export default Message;
