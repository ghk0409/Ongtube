import express from "express";
import { registerView, createComment } from "../controllers/videoController";

const apiRouter = express.Router();

// 조회수 등록 API
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
// 댓글 등록 API
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);

export default apiRouter;
