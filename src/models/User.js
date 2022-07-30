import bcrypt from "bcrypt";
import mongoose from "mongoose";

// 유저 스키마
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    avatarUrl: String,
    socialOnly: { type: Boolean, default: false },
    username: { type: String, required: true, unique: true },
    password: { type: String },
    name: { type: String, required: true },
    location: String,
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Comment",
        },
    ],
    videos: [{ type: mongoose.Schema.Types.ObjectId, ref: "Video" }],
});

// 패스워드 해싱 암호화 처리
userSchema.pre("save", async function () {
    if (this.isModified("password")) {
        this.password = await bcrypt.hash(this.password, 5);
    }
});

// 유저 모델 생성
const User = mongoose.model("User", userSchema);

// 모델 export
export default User;
