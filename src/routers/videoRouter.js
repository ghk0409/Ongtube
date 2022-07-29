import express from "express";
import {
    watch,
    getEdit,
    postEdit,
    getUpload,
    postUpload,
    deleteVideo,
} from "../controllers/videoController";
import { protectorMiddleware, videoUpload } from "../middlewares";

const videoRouter = express.Router();

// 비디오 기본 정보 페이지 라우터
videoRouter.get("/:id([0-9a-f]{24})", watch);
// 비디오 정보 수정 페이지 라우터 (GET / POST 분리)
videoRouter
    .route("/:id([0-9a-f]{24})/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(postEdit);
// 비디오 삭제 페이지 라우터
videoRouter
    .route("/:id([0-9a-f]{24})/delete")
    .all(protectorMiddleware)
    .get(deleteVideo);
// 비디오 업로드 페이지 라우터 (GET / POST 분리)
videoRouter
    .route("/upload")
    .all(protectorMiddleware)
    .get(getUpload)
    .post(
        videoUpload.fields([
            { name: "video", maxCount: 1 },
            { name: "thumb", maxCount: 1 },
        ]),
        postUpload
    );

export default videoRouter;
