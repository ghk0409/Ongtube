import mongoose from "mongoose";

// 비디오 데이터 스키마 (데이터의 형식 정의)
const videoSchema = new mongoose.Schema({
    title: { type: String, required: true, trim: true, maxLength: 80 }, // { type: String }과 동일
    fileUrl: { type: String, required: true },
    description: { type: String, required: true, trim: true, minLength: 10 },
    createdAt: { type: Date, required: true, default: Date.now },
    hashtags: [{ type: String, required: true, trim: true }],
    meta: {
        views: { type: Number, default: 0, required: true },
        rating: { type: Number, default: 0, required: true },
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
});

// static function 만들어서 사용
videoSchema.static("formatHashtags", function (hashtags) {
    return hashtags
        .split(",")
        .map((word) =>
            word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
        );
});

// Middleware 적용
// videoSchema.pre("save", async function () {
//     this.hashtags = this.hashtags[0]
//         .split(",")
//         .map((word) =>
//             word.trim().startsWith("#") ? word.trim() : `#${word.trim()}`
//         );
// });

// 비디오 데이터 모델
const Video = mongoose.model("Video", videoSchema);
// 비디오 모델 export
export default Video;
