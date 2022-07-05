import mongoose from "mongoose";

// 유저 스키마
const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: { type: String, required: true },
    location: String,
});

// 유저 모델 생성
const User = mongoose.model("User", userSchema);

// 모델 export
export default User;
