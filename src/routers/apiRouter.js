import express from "express";
import {
    registerView,
    createComment,
    deleteComment,
} from "../controllers/videoController";

const apiRouter = express.Router();

// 조회수 등록 API
apiRouter.post("/videos/:id([0-9a-f]{24})/view", registerView);
// 댓글 등록 API
apiRouter.post("/videos/:id([0-9a-f]{24})/comment", createComment);
// 댓글 삭제 API
apiRouter.get("/comment/:id([0-9a-f]{24})/delete", deleteComment);

export default apiRouter;
