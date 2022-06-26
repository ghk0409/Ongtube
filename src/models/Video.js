import mongoose from "mongoose";

// 비디오 데이터 스키마 (데이터의 형식 정의)
const videoSchema = new mongoose.Schema({
    title: String, // { type: String }과 동일
    description: String,
    createdAt: Date,
    hashtags: [{ type: String }],
    meta: {
        views: Number,
        rating: Number,
    },
});

// 비디오 데이터 모델
const Video = mongoose.model("Video", videoSchema);
// 비디오 모델 export
export default Video;
