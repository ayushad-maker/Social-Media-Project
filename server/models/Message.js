import mongoose from "mongoose";

const MessageSchema = new mongoose.Schema(
  {
    from_user_id: { type: String, ref: User, required: true },
    to_user_id: { type: String, ref: User, required: true },
    message_type: { type: String,enum:['text','image']},
    media_url: { type: String },
    text: { type: String, trim: true },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true, minimize: false },
);

const Message = mongoose.model("Message", MessageSchema);

export default Message;
