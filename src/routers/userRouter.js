import express from "express";
import {
    logout,
    see,
    startGithubLogin,
    finishGithubLogin,
    getEdit,
    postEdit,
    getChangePassword,
    postChangePassword,
    startKakaoLogin,
    finishKakaoLogin,
} from "../controllers/userController";
import {
    avatarUpload,
    protectorMiddleware,
    publicOnlyMiddleware,
} from "../middlewares";

const userRouter = express.Router();

// 로그아웃 라우터
userRouter.get("/logout", protectorMiddleware, logout);
// 유저 프로필 수정 라우터
userRouter
    .route("/edit")
    .all(protectorMiddleware)
    .get(getEdit)
    .post(avatarUpload.single("avatar"), postEdit);
// 비밀번호 변경 라우터
userRouter
    .route("/change-password")
    .all(protectorMiddleware)
    .get(getChangePassword)
    .post(postChangePassword);
// github 로그인 관련 라우터
userRouter.get("/github/start", publicOnlyMiddleware, startGithubLogin);
userRouter.get("/github/finish", publicOnlyMiddleware, finishGithubLogin);
// kakao 로그인 관련 라우터
userRouter.get("/kakao/start", publicOnlyMiddleware, startKakaoLogin);
userRouter.get("/kakao/finish", publicOnlyMiddleware, finishKakaoLogin);
// 유저 프로필 라우터
userRouter.get("/:id([0-9a-f]{24})", see);

export default userRouter;
