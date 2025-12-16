import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import chatRouter from "../routes/chat.js";

dotenv.config();
const app = express();
app.use(express.json());

// CORS - parse ALLOWED_ORIGINS from .env (comma-separated)
const allowed = (process.env.ALLOWED_ORIGINS || "").split(",");
app.use(cors({
  origin: function(origin, callback){
    // allow requests with no origin (like mobile apps, curl)
    if(!origin) return callback(null, true);
    if(allowed.length === 0 || allowed.includes(origin)) return callback(null, true);
    return callback(new Error('Not allowed by CORS'));
  }
})); 

app.use("/api/chat", chatRouter);

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Backend running on port ${port}`);
});
