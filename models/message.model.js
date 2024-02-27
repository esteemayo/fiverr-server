import mongoose from 'mongoose';

const { Schema } = mongoose;

const messageSchema = new Schema(
  {
    conversationId: {
      type: String,
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

messageSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'user',
    select: 'username image',
  });

  next();
});

const Message =
  mongoose.models.Message || mongoose.model('Message', messageSchema);

export default Message;
