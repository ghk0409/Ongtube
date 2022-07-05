/**
 * * server.js
 * * > express 및 서버의 configuration 관련 처리
 */
import express from "express";
import morgan from "morgan";
import rootRouter from "./routers/rootRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

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

/**
 * 라우터
 */
app.use("/", rootRouter); // 메인 페이지
app.use("/users", userRouter); // 유저 관련 페이지
app.use("/videos", videoRouter); // 비디오 관련 페이지

export default app;
