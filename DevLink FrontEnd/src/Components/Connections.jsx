import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useDispatch, useSelector } from "react-redux";
import { addConnections } from "../utils/connectionSlice";

const Connections = () => {
  const connections = useSelector((store) => store.connections);
  const dispatch = useDispatch();

  const fetchConnections = async () => {
    try {
      if (connections && connections.length > 0) return;

      const res = await axios.get(BASE_URL + "/user/connections", {
        withCredentials: true,
      });

      dispatch(addConnections(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching connections:", err);
    }
  };

  useEffect(() => {
    fetchConnections();
  }, []);

  if (!connections) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading connections...
      </div>
    );
  }

  if (connections.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-12 py-10 shadow-xl text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            No Connections Yet
          </h2>
          <p className="text-gray-400">
            Start connecting with developers to see them here 🚀
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">

      <h1 className="text-3xl font-bold text-center text-white mb-12">
        Your Connections
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {connections.map((user) => {
          const { _id, firstName, lastName, photoUrl, age, gender, about } = user;

          return (
            <div
              key={_id}
              className="backdrop-blur-xl bg-white/5 border border-white/10 rounded-2xl p-6 shadow-xl transition-all duration-300 hover:bg-white/10 hover:scale-105"
            >
              <div className="flex flex-col items-center text-center">

                <img
                  src={
                    photoUrl ||
                    "https://geographyandyou.com/images/user-profile.png"
                  }
                  alt={`${firstName} ${lastName}`}
                  className="w-28 h-28 rounded-full object-cover border border-pink-500/40"
                />

                <h2 className="mt-4 text-lg font-semibold text-white">
                  {firstName} {lastName}
                </h2>

                {age && gender && (
                  <p className="text-sm text-gray-400">
                    {age} • {gender}
                  </p>
                )}

                <p className="mt-3 text-sm text-gray-300">
                  {about || "This user has no bio yet."}
                </p>

              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};

export default Connections;