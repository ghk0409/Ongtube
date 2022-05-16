import express from "express";

const PORT = 4000;

// express function을 사용하여 express application 만들기
const app = express();

// handleListening 메서드
const handleListening = () =>
    console.log(`Server listening on http://localhost:${PORT} 🚀`);

// 서버 listen 상태 구동
app.listen(PORT, handleListening);
