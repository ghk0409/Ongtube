import mongoose from "mongoose";

// mongodb에 연결할 database를 'url/DB명' 형태로 입력
mongoose.connect(process.env.DB_URL, {});

// 서버와 DB서버 간의 연결 (connection access)
const db = mongoose.connection;

const handleOpen = () => console.log("✅ Connected to DB");
const handleError = (error) => console.log("❌ DB Error", error);
// on: 여러 번 발생 가능 -> error는 여러 번 발생 가능
db.on("error", handleError);
// once: 오로지 한 번만 발생
db.once("open", handleOpen);
