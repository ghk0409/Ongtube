/**
 * * server.js
 * * > express 및 서버의 configuration 관련 처리
 */
import express from "express";
import morgan from "morgan";
import session from "express-session";
import flash from "express-flash";
import MongoStore from "connect-mongo";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";
import apiRouter from "./routers/apiRouter";
import { localsMiddleware } from "./middlewares";

// express function을 사용하여 express application 만들기
const app = express();
// morgan의 [dev] 옵션을 통한 logger 설정
const logger = morgan("dev");

// view engine 설정(pug 사용!) 및 view 기본 경로 설정
app.set("view engine", "pug");
app.set("views", process.cwd() + "/src/views");

/**
 * 미들웨어
 */
// app.use()는 어떤 URL 호출 시에도 동일하게 작동할 middleware 설정할 수 있음
app.use(logger);
// form의 value들을 이해할 수 있고 자바스크립트 형식(오브젝트)으로 만들어줌
app.use(express.urlencoded({ extended: true }));

// Session 미들웨어 적용
app.use(
    session({
        secret: process.env.COOKIE_SECRET,
        resave: false, // 모든 request의 세션에 대한 저장 여부
        saveUninitialized: false, // 초기화되지 않은 세션의 저장 여부
        store: MongoStore.create({
            mongoUrl: process.env.DB_URL,
        }),
    })
);

// flash mesaage 미들웨어
// session을 이용하여 사용자에게 메시지를 남기기 위함
app.use(flash());
// locals 설정 미들웨어 (반드시 session 미들웨어 이후에 나와야 session에 접근 가능!!)
app.use(localsMiddleware);

// Static Files Serving
app.use("/uploads", express.static("uploads")); // uploads folder
app.use("/static", express.static("assets")); // frontend static files
// 비디오 업로드 시 sharedArrayBuffer 에러 방지를 위한 Cross origin isolation 미들웨어
app.use((req, res, next) => {
    res.header("Cross-Origin-Embedder-Policy", "require-corp");
    res.header("Cross-Origin-Opener-Policy", "same-origin");
    next();
});
/**
 * 라우터
 */
app.use("/", rootRouter); // 메인 페이지
app.use("/users", userRouter); // 유저 관련 페이지
app.use("/videos", videoRouter); // 비디오 관련 페이지
app.use("/api", apiRouter); // api 라우터

export default app;
