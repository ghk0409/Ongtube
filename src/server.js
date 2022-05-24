import express from "express";
import morgan from "morgan";

const PORT = 4000;

// express function을 사용하여 express application 만들기
const app = express();

// middleware
// const logger = (req, res, next) => {
//     console.log(`${req.method} ${req.url}`);
//     next();
// };
const logger = morgan("dev");

const privateMiddleware = (req, res, next) => {
    const url = req.url;
    if (url === "/protected") {
        return res.send("<h1>Not Allowed 나.가.</h1>");
    }
    console.log("OK. Go GO Go");
    next();
};

// route 설정하기
// root 페이지(/) get request 처리, route handler argument = (requset, response)
const handleHome = (req, res) => res.send({ msg: "I want to you!~!" });

// login 페이지 route
const handleLogin = (req, res) => {
    return res.send("<h1>This is Login Page baby~</h1>");
};

const handleProtected = (req, res) => {
    return res.send("안 보일껄ㅋㅋㅋ");
};

// app.use()는 어떤 URL 호출 시에도 동일하게 작동할 middleware 설정할 수 있음
app.use(logger);
app.get("/", handleHome);
app.get("/login", handleLogin);
app.get("/protected", handleProtected);

// handleListening 메서드
const handleListening = () =>
    console.log(`Server listening on http://localhost:${PORT} 🚀`);

// 서버 listen 상태 구동
app.listen(PORT, handleListening);
