import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import axios from "axios";
import { io } from "socket.io-client";
import { BASE_URL } from "../utils/constants";
import { ArrowLeft, Send, MessageSquare } from "lucide-react";

const Chat = () => {
  const { targetUserId } = useParams();
  const navigate = useNavigate();
  const loggedUser = useSelector((store) => store.user);
  
  const [chat, setChat] = useState(null);
  const [newMessage, setNewMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chat?.messages]);

  useEffect(() => {
    let active = true;

    const initChat = async () => {
      try {
        setLoading(true);
        setError(null);

        // 1. Verify and Fetch historical chat
        const res = await axios.get(`${BASE_URL}/chat/${targetUserId}`, {
          withCredentials: true,
        });

        if (!active) return;
        setChat(res.data);
        setLoading(false);

        // 2. Establish Socket connection ONLY after success
        const socketInstance = io(BASE_URL, {
          withCredentials: true,
          transports: ["websocket", "polling"],
        });

        socketRef.current = socketInstance;

        socketInstance.on("connect", () => {
          console.log("Socket connected successfully");
          socketInstance.emit("joinChat", { targetUserId });
        });

        socketInstance.on("messageReceived", (msg) => {
          setChat((prevChat) => {
            if (!prevChat) return prevChat;
            const exists = prevChat.messages.some((m) => m._id === msg._id);
            if (exists) return prevChat;
            return {
              ...prevChat,
              messages: [...prevChat.messages, msg],
            };
          });
        });

        socketInstance.on("connect_error", (err) => {
          console.error("Socket connection error:", err);
        });

      } catch (err) {
        if (active) {
          console.error("Chat init error:", err);
          setError(
            err.response?.data?.message || err.message || "Failed to load chat"
          );
          setLoading(false);
        }
      }
    };

    initChat();

    return () => {
      active = false;
      if (socketRef.current) {
        socketRef.current.off("messageReceived");
        socketRef.current.disconnect();
      }
    };
  }, [targetUserId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (!newMessage.trim() || !socketRef.current) return;

    socketRef.current.emit("sendMessage", {
      targetUserId,
      text: newMessage.trim(),
    });
    setNewMessage("");
  };

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-400">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <span className="ml-3 mt-4 text-sm font-medium">Loading chat history...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Unable to Start Chat</h2>
          <p className="text-gray-300 text-sm">
            {error === "Users are not connected"
              ? "You must be connected with this developer before you can chat."
              : error}
          </p>
          <button
            onClick={() => navigate("/connections")}
            className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
          >
            Back to Connections
          </button>
        </div>
      </div>
    );
  }

  const friend = chat?.participants?.find(
    (p) => loggedUser?._id && (p._id !== loggedUser._id)
  );
  const friendName = friend && friend.firstName
    ? `${friend.firstName} ${friend.lastName || ""}`.trim()
    : "Developer Chat";
  const friendPhoto =
    friend?.photoUrl || "https://geographyandyou.com/images/user-profile.png";

  return (
    <div className="max-w-4xl mx-auto w-full py-8 px-4 h-[80vh] flex flex-col">
      <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl shadow-xl flex flex-col flex-1 overflow-hidden">
        
        {/* HEADER */}
        <div className="flex items-center justify-between px-6 py-4 bg-white/5 border-b border-white/10">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate("/connections")}
              className="text-gray-400 hover:text-white p-1.5 rounded-lg hover:bg-white/10 transition"
              title="Back to Connections"
            >
              <ArrowLeft className="w-6 h-6" />
            </button>
            
            <img
              src={friendPhoto}
              alt={friendName}
              className="w-10 h-10 rounded-full object-cover border border-pink-500/40"
            />
            
            <div>
              <h2 className="text-base font-semibold text-white leading-tight">
                {friendName}
              </h2>
              <p className="text-xs text-emerald-400 flex items-center gap-1.5 mt-0.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                Connected
              </p>
            </div>
          </div>
        </div>

        {/* MESSAGES */}
        <div className="flex-grow overflow-y-auto p-6 space-y-4 bg-[#0f172a]/20">
          {chat?.messages?.length === 0 ? (
            <div className="h-full flex flex-col justify-center items-center text-center p-6">
              <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/20">
                <MessageSquare className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-white">No messages yet</h3>
              <p className="text-sm text-gray-400 mt-1 max-w-xs">
                Start the conversation by typing a message below!
              </p>
            </div>
          ) : (
            chat.messages.map((msg) => {
              const isMe =
                msg.senderId?._id === loggedUser?._id ||
                msg.senderId === loggedUser?._id;
              
              const timeString = msg.createdAt
                ? new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })
                : "";

              return (
                <div
                  key={msg._id}
                  className={`flex ${isMe ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-[70%] rounded-2xl px-4 py-2.5 shadow-md flex flex-col gap-1 ${
                      isMe
                        ? "bg-linear-to-r from-pink-500 to-purple-600 text-white rounded-br-none"
                        : "bg-white/10 text-gray-100 rounded-bl-none border border-white/5"
                    }`}
                  >
                    <p className="text-[14px] leading-relaxed break-words whitespace-pre-wrap">
                      {msg.text}
                    </p>
                    <span className="text-[10px] text-white/60 self-end">
                      {timeString}
                    </span>
                  </div>
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* INPUT FORM */}
        <form
          onSubmit={handleSendMessage}
          className="p-4 bg-white/5 border-t border-white/10 flex items-center gap-3"
        >
          <input
            type="text"
            placeholder="Type a message..."
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white text-sm focus:outline-none focus:border-pink-500/50 placeholder-gray-500 transition"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="p-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition disabled:opacity-50 disabled:hover:scale-100 flex items-center justify-center shadow-lg shadow-pink-500/20 cursor-pointer"
          >
            <Send className="w-5 h-5" />
          </button>
        </form>

      </div>
    </div>
  );
};

export default Chat;
