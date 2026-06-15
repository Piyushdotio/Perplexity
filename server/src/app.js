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
app.use(cors({
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps, curl, postman)
        if (!origin) return callback(null, true);
        if (/^https?:\/\/(localhost|127\.0\.0\.1)(:\d+)?$/.test(origin)) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
    },
    credentials:true,
    methods:['GET','POST','PUT','DELETE']
}))

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "dist", "index.html"));
});

// Routes
app.use("/api/auth", authRouter)
app.use("/api/chats",chatRouter)

export default  app
