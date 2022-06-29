import mongoose from "mongoose";

// 비디오 데이터 스키마 (데이터의 형식 정의)
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true }, // { type: String }과 동일
    description: { type: String, required: true },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, required: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
});

// 비디오 데이터 모델
const Video = mongoose.model("Video", videoSchema);
// 비디오 모델 export
export default Video;
