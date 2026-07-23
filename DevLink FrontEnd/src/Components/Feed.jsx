import axios from "axios";
import { useEffect } from "react";
import { BASE_URL } from "../utils/constants";
import { useSelector, useDispatch } from "react-redux";
import { addfeed } from "../utils/feedSlice";
import UserCard from "./UserCard";

const Feed = () => {
  const dispatch = useDispatch();
  const feed = useSelector((store) => store.feed);

  const getFeed = async () => {
    if (feed && feed.length > 0) return;

    try {
      const res = await axios.get(BASE_URL + "/feed", {
        withCredentials: true,
      });

      dispatch(addfeed(res?.data?.data));
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getFeed();
  }, []);

return (
  <div className="flex justify-center items-center min-h-[80vh] relative">
    <div className="relative w-80 h-125">
      {feed && feed.length > 0 ? (
        feed.slice(0, 2).map((user, index) => (
          <UserCard
            key={user._id}
            user={user}
            isTop={index === 0}
          />
        ))
      ) : (
        <div className="text-white text-xl">
          No new profiles available 🚀
        </div>
      )}
    </div>
  </div>
);
};

export default Feed;