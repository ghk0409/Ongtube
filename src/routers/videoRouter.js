import express from "express";
import {
    watch,
    getEdit,
    postEdit,
    getUpload,
    postUpload,
    deleteVideo,
} from "../controllers/videoController";

const videoRouter = express.Router();

// 비디오 기본 정보 페이지 라우터
videoRouter.get("/:id([0-9a-f]{24})", watch);
// 비디오 정보 수정 페이지 라우터 (GET / POST 분리)
videoRouter.route("/:id([0-9a-f]{24})/edit").get(getEdit).post(postEdit);
// 비디오 삭제 페이지 라우터
videoRouter.route("/:id([0-9a-f]{24})/delete").get(deleteVideo);
// 비디오 업로드 페이지 라우터 (GET / POST 분리)
videoRouter.route("/upload").get(getUpload).post(postUpload);

export default videoRouter;
