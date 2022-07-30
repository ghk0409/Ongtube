/**
 * * init.js
 * * > 서버 시작 시 필요한 모든 기능 초기화(import)
 *
 */
import "dotenv/config";
import "./db";
// db와 mongoose 연결 후 Model 인식
import "./models/Video";
import "./models/User";
import "./models/Comment";
import app from "./server";

const PORT = 4000;

// handleListening 메서드
const handleListening = () =>
    console.log(`✅ Server listening on http://localhost:${PORT} 🚀`);

// 서버 listen 상태 구동
app.listen(PORT, handleListening);
