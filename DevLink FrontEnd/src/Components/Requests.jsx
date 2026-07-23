import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import axios from "axios";
import { useDispatch, useSelector } from "react-redux";
import { addRequests, removeRequest } from "../utils/requestSlice";

const Requests = () => {
  const dispatch = useDispatch();
  const requests = useSelector((store) => store.requests);

  const reviewRequest = async (status, _id) => {
    try {
      await axios.post(
        BASE_URL + "/request/review/" + status + "/" + _id,
        {},
        { withCredentials: true }
      );

      dispatch(removeRequest(_id));
    } catch (err) {
      console.error("Error reviewing request:", err);
    }
  };

  const fetchRequests = async () => {
    try {
      const res = await axios.get(BASE_URL + "/user/requests/received", {
        withCredentials: true,
      });

      dispatch(addRequests(res?.data?.data || []));
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  if (!requests) {
    return (
      <div className="flex justify-center py-20 text-gray-400">
        Loading connection requests...
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <div className="flex justify-center py-20">
        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl px-12 py-10 shadow-xl text-center">
          <h2 className="text-xl font-semibold text-white mb-3">
            No Connection Requests
          </h2>
          <p className="text-gray-400">
            When someone sends you a request, it will appear here.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-16 px-6">
      <h1 className="text-3xl font-bold text-center text-white mb-12">
        Connection Requests
      </h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {requests.map((request) => {
          const {
            _id,
            firstName,
            lastName,
            photoUrl,
            age,
            gender,
            about,
          } = request.fromID;

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
                  className="w-24 h-24 rounded-full border border-pink-500/40 object-cover"
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

                <div className="flex gap-4 mt-6">

                  <button
                    onClick={() =>
                      reviewRequest("rejected", request._id)
                    }
                    className="px-5 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition-all duration-300"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() =>
                      reviewRequest("accepted", request._id)
                    }
                    className="px-5 py-2 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-md"
                  >
                    Accept
                  </button>

                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Requests;