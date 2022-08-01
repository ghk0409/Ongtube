import mongoose from "mongoose";
import User from "./User";
import Video from "./Video";

// 댓글 스키마 생성
const commentSchema = new mongoose.Schema({
    contents: { type: String, required: true },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    video: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Video",
    },
    createdAt: { type: Date, required: true, default: Date.now },
});

// 댓글 모델 생성
const Comment = mongoose.model("Comment", commentSchema);

export default Comment;
