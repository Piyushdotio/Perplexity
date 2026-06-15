import express from  "express"
import cookieParser from "cookie-parser"
import authRouter from "./routes/auth.route.js"
import chatRouter from "./routes/chat.route.js"
import morgan from 'morgan'
import cors from 'cors'
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const app=express() 

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
app.use(express.static('./dist'))
app.use(cookieParser())
app.use(morgan("dev"))
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  process.env.CLIENT_URL,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);

// Routes
app.use("/api/auth", authRouter)
app.use("/api/chats",chatRouter)

app.get("/{*splat}", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist", "index.html"));
});

export default  app
