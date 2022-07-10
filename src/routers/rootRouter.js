import express from "express";
import {
    getJoin,
    postJoin,
    getLogin,
    postLogin,
} from "../controllers/userController";
import { home, search } from "../controllers/videoController";

const rootRouter = express.Router();

// 메인 페이지(root) 라우터
rootRouter.get("/", home);
// 회원가입 페이지 라우터 (GET / POST 분리)
rootRouter.route("/join").get(getJoin).post(postJoin);
rootRouter.route("/login").get(getLogin).post(postLogin);
rootRouter.get("/search", search);

export default rootRouter;
