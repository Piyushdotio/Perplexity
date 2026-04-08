import { generatemessage, generatechatTitle } from "../services/ai.service.js";
import chatModel from "../models/chat.model.js";
import messageModel from "../models/message.model.js";

export async function sendMessage(req, res) {
  try {
    const { message, chatId } = req.body;
    const userId = req.user._id || req.user.id;

    if (!message) {
      return res.status(400).json({
        message: "Message is required",
        success: false,
        err: "Missing message",
      });
    }

    let title = null;
    let chat = null;
    if (!chatId) {
      title = await generatechatTitle(message);
      chat = await chatModel.create({
        user: userId,
        title,
      });
    }
    const activeChatId = chatId || chat._id;

    await messageModel.create({
      chat: activeChatId,
      content: message,
      role: "user",
    });
    const messages = await messageModel
      .find({ chat: activeChatId })
      .sort({ createdAt: 1 });
    const result = await generatemessage(messages);

    const aiMessage = await messageModel.create({
      chat: activeChatId,
      content: result,
      role: "ai",
    });

    const activeChat = chat || (await chatModel.findById(activeChatId));

    res.json({
      title: activeChat?.title || title,
      chat: activeChat,
      success: true,
      aiMessage,
    });
  } catch (error) {
    console.error("Failed to generate chat response:", error);
    res.status(500).json({
      message: "Failed to generate chat response",
      success: false,
      err: error.message,
    });
  }
}

export async function getChats(req, res) {
  const userId = req.user._id || req.user.id;
  const chats = await chatModel.find({ user: userId });

  return res.status(200).json({
    chats,
  });
}

export async function getMessages(req, res) {
  const { chatId } = req.params;
  const userId = req.user._id || req.user.id;
  const chat = await chatModel.findOne({
    _id: chatId,
    user: userId,
  });
  if (!chat) {
    return res.status(404).json({
      message: "chat not Found",
    });
  }
  const messages = await messageModel.find({
    chat: chatId||chat._id,
  });
  return res.status(200).json({
    message: "Messages retrieved successfully",
    messages,
  });
}

export async function deletechat(req,res){
 const {chatId} = req.params
 const userId=req.user.id
 const chat=await chatModel.findOneAndDelete({
    _id:chatId,
    user:userId
 })

  await messageModel.deleteMany({
    chat:chatId
  })
    if (!chat) {
    return res.status(404).json({
      message: "chat not Found",
    });
  }
  return res.status(200).json({
    message:"chat deleted successfully"
  })
  

}
