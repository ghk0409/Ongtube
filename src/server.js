import express from "express";

const PORT = 4000;

// express function을 사용하여 express application 만들기
const app = express();

// route 설정하기
// root 페이지(/) get request 처리, route handler argument = (requset, response)
const handleHome = (req, res) => {
    return res.send({ msg: "I want to you!" });
};

// login 페이지 route
const handleLogin = (req, res) => {
    return res.send("<h1>This is Login Page baby~</h1>");
};

app.get("/", handleHome);
app.get("/login", handleLogin);

// handleListening 메서드
const handleListening = () =>
    console.log(`Server listening on http://localhost:${PORT} 🚀`);

// 서버 listen 상태 구동
app.listen(PORT, handleListening);
