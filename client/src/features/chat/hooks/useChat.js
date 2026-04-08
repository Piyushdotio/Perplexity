import { useDispatch, useSelector } from "react-redux";
import { initializeSocketConnection } from "../../chat/service/chat.socket";
import { sendMessage } from "../service/chat.api";
import { setChats, setLoading, setError, setcurrentChatId } from "../chat.slice";

export const useChat = () => {
  const dispatch = useDispatch();
  const { chats, currentChatId } = useSelector((state) => state.chat);

  async function handleSendMessage({ message, chatId }) {
    dispatch(setLoading(true));
    dispatch(setError(null));

    try {
      const data = await sendMessage({ message, chatId });
      const activeChatId = data?.chat?._id || chatId || currentChatId;
      const aiMessage = data?.aiMessage;

      if (!activeChatId) {
        throw new Error("Chat id missing from sendMessage response");
      }

      const existingChat = chats?.[activeChatId] || {};
      const updatedChat = {
        ...existingChat,
        ...(data?.chat || {}),
        _id: activeChatId,
        title: data?.chat?.title || existingChat.title || data?.title || "New chat",
        messages: [
          ...(existingChat.messages || []),
          { content: message, role: "user" },
          ...(aiMessage ? [aiMessage] : []),
        ],
      };

      dispatch(
        setChats({
          ...chats,
          [activeChatId]: updatedChat,
        })
      );
      dispatch(setcurrentChatId(activeChatId));

      return data;
    } catch (error) {
      dispatch(setError(error?.response?.data?.message || error.message));
      throw error;
    } finally {
      dispatch(setLoading(false));
    }
  }

  return {
    initializeSocketConnection,
    handleSendMessage,
  };
};
