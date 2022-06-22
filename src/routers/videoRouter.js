import express from "express";
import { watch, getEdit, postEdit } from "../controllers/videoController";

const videoRouter = express.Router();

videoRouter.get("/:id(\\d+)", watch);

// 비디오 정보 수정 페이지 라우터 (GET / POST 분리)
videoRouter.route("/:id(\\d+)/edit").get(getEdit).post(postEdit);

export default videoRouter;
