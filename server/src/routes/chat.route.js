import { Router } from "express";
import {
  sendMessage,
  getChats,
  getMessages,
  deletechat
} from "../controller/chat.controller.js";
import { authUser } from "../middleware/auth.middleware.js";

const chatRouter = Router();

chatRouter.post("/message", authUser, sendMessage);

chatRouter.get("/", authUser, getChats);
chatRouter.get("/:chatId/messages", authUser, getMessages);

chatRouter.get("/delete/:chatId",authUser,deletechat)

export default chatRouter;
