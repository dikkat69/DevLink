import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { MessageSquare } from "lucide-react";

const ChatList = () => {
  const [people, setPeople] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const fetchChats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`${BASE_URL}/chat`, {
        withCredentials: true,
      });
      setPeople(res.data || []);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching chat list:", err);
      setError(err.response?.data?.message || "Failed to load chats");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChats();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col justify-center items-center py-20 text-gray-400">
        <span className="loading loading-spinner loading-lg text-pink-500"></span>
        <span className="ml-3 mt-4 text-sm font-medium">Loading conversations...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto py-16 px-6">
        <div className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-8 shadow-xl text-center space-y-4">
          <h2 className="text-xl font-bold text-red-400">Failed to Load Chats</h2>
          <p className="text-gray-300 text-sm">{error}</p>
          <button
            onClick={fetchChats}
            className="w-full py-2.5 px-4 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-16 px-6 w-full">
      <h1 className="text-3xl font-bold text-center text-white mb-12">
        Your Conversations
      </h1>

      {people.length === 0 ? (
        <div className="flex justify-center">
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-12 py-10 shadow-xl text-center max-w-md">
            <div className="w-16 h-16 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400 mb-4 border border-pink-500/20 mx-auto">
              <MessageSquare className="w-8 h-8" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">
              No Conversations Yet
            </h2>
            <p className="text-gray-400 text-sm mb-6">
              Go to your connections list to start a conversation with a developer.
            </p>
            <button
              onClick={() => navigate("/connections")}
              className="py-2.5 px-6 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition shadow-lg shadow-pink-500/20 cursor-pointer"
            >
              View Connections
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-4 max-w-xl mx-auto w-full">
          {people.map((user) => {
            const { _id, firstName, lastName, photoUrl, skills, about } = user;
            const subtitle = skills && skills.length > 0
              ? skills.slice(0, 3).join(" • ")
              : (about || "Active Developer");

            return (
              <div
                key={_id}
                onClick={() => navigate(`/chat/${_id}`)}
                className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-5 shadow-xl flex items-center gap-5 transition-all duration-300 hover:bg-white/10 hover:scale-[1.02] cursor-pointer"
              >
                <img
                  src={photoUrl || "https://geographyandyou.com/images/user-profile.png"}
                  alt={`${firstName} ${lastName}`}
                  className="w-16 h-16 rounded-full object-cover border border-pink-500/40 shrink-0"
                />

                <div className="flex-grow min-w-0">
                  <h2 className="text-lg font-semibold text-white truncate">
                    {firstName} {lastName}
                  </h2>
                  <p className="text-sm text-gray-400 truncate mt-1">
                    {subtitle}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default ChatList;
