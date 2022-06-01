import express from "express";
import morgan from "morgan";
import globalRouter from "./routers/globalRouter";
import userRouter from "./routers/userRouter";
import videoRouter from "./routers/videoRouter";

const PORT = 4000;

// express function을 사용하여 express application 만들기
const app = express();
// morgan의 [dev] 옵션을 통한 logger 설정
const logger = morgan("dev");
// app.use()는 어떤 URL 호출 시에도 동일하게 작동할 middleware 설정할 수 있음
app.use(logger);

// 라우터 설정
app.use("/", globalRouter);
app.use("/users", userRouter);
app.use("/videos", videoRouter);

// handleListening 메서드
const handleListening = () =>
    console.log(`Server listening on http://localhost:${PORT} 🚀`);

// 서버 listen 상태 구동
app.listen(PORT, handleListening);
