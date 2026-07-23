import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { removeUserFromFeed } from "../utils/feedSlice";
import { motion,
  useMotionValue,
  useTransform,
  useAnimation,
} from "framer-motion";

const UserCard = ({ user, isTop }) => {
  const { _id, firstName, lastName, gender, age, photoUrl, about } = user;

  const dispatch = useDispatch();
  const controls = useAnimation();

  // Track horizontal drag
  const x = useMotionValue(0);

  // Rotate card slightly while dragging
  const rotate = useTransform(x, [-300, 300], [-15, 15]);

  // Badge opacity (live while dragging)
  const likeOpacity = useTransform(x, [50, 150], [0, 1]);
  const nopeOpacity = useTransform(x, [-150, -50], [1, 0]);

  const handleSwipe = async (direction) => {
    const flyAwayX = direction === "right" ? 1000 : -1000;
    const flyAwayRotate = direction === "right" ? 20 : -20;

    await controls.start({
      x: flyAwayX,
      rotate: flyAwayRotate,
      opacity: 0,
      transition: { duration: 0.4 },
    });

    try {
      await axios.post(
        BASE_URL +
          "/request/send/" +
          (direction === "right" ? "interested" : "ignored") +
          "/" +
          _id,
        {},
        { withCredentials: true }
      );

      dispatch(removeUserFromFeed(_id));
    } catch (err) {
      console.error(err);
    }
  };

  const handleDragEnd = (event, info) => {
    if (!isTop) return;

    if (info.velocity.x > 500 || info.offset.x > 150) {
      handleSwipe("right");
    } else if (info.velocity.x < -500 || info.offset.x < -150) {
      handleSwipe("left");
    } else {
      controls.start({ x: 0, rotate: 0 });
    }
  };

  return (
    <motion.div
      drag={isTop ? "x" : false}
      dragConstraints={{ left: 0, right: 0 }}
      onDragEnd={handleDragEnd}
      style={{ x, rotate }}
      animate={controls}
      className={`absolute top-0 left-0 w-80 h-125 flex flex-col
        bg-white/5 backdrop-blur-xl border border-white/10
        rounded-2xl shadow-2xl overflow-hidden
        ${isTop ? "z-10" : "z-0 scale-95"}
      `}
    >
      {/* IMAGE */}
      <div className="relative w-full h-3/4 overflow-hidden">
        <img
          src={photoUrl || "https://via.placeholder.com/400"}
          alt="Profile"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/10 to-transparent" />

{/* BADGES */}
{isTop && (
  <>
    {/* INTERESTED */}
    <motion.div
      style={{
        opacity: likeOpacity,
        scale: likeOpacity,
      }}
      className="absolute top-12 left-6 
        px-6 py-3 
        text-3xl font-extrabold tracking-wider
        border-4 border-emerald-400
        text-emerald-400
        bg-white/10 backdrop-blur-md
        rounded-xl
        shadow-lg
        rotate-[-18deg]"
    >
      💚 INTERESTED
    </motion.div>

    {/* IGNORED */}
    <motion.div
      style={{
        opacity: nopeOpacity,
        scale: nopeOpacity,
      }}
      className="absolute top-12 right-6 
        px-6 py-3 
        text-3xl font-extrabold tracking-wider
        border-4 border-rose-400
        text-rose-400
        bg-white/10 backdrop-blur-md
        rounded-xl
        shadow-lg
        rotate-18"
      >
      ❌ IGNORED
    </motion.div>
    </>
    )}
        <div className="absolute bottom-4 left-4 text-white">
          <h2 className="text-xl font-semibold">
            {firstName} {lastName}
          </h2>
          {age && gender && (
            <p className="text-sm text-gray-300">
              {age} • {gender}
            </p>
          )}
        </div>
      </div>

      {/* BIO */}
      <div className="flex flex-col justify-between flex-1 p-4">
        <p className="text-sm text-gray-300 line-clamp-3">
          {about || "No bio provided yet."}
        </p>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleSwipe("left")}
            className="flex-1 py-2 rounded-xl border border-red-500/40 text-red-400 hover:bg-red-500/10 transition"
          >
            Ignore
          </button>

          <button
            onClick={() => handleSwipe("right")}
            className="flex-1 py-2 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition"
          >
            Interested
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default UserCard;