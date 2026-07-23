import { useSelector, useDispatch } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { removeUser } from "../utils/userSlice";

const NavBar = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);

  const handleLogout = async () => {
    try {
      await axios.post(BASE_URL + "/logout", {}, { withCredentials: true });
      dispatch(removeUser());
      navigate("/login");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="navbar px-8 py-4 backdrop-blur-xl bg-white/5 border-b border-white/10">

      {/* Left - Logo */}
      <div className="flex-1">
        <Link
          to="/feed"
          className="text-2xl font-bold tracking-wide text-white hover:text-pink-400 transition"
        >
          DevLink
        </Link>
      </div>

      {/* Right - User Section */}
      {user && (
        <div className="flex items-center gap-6">

          <span className="hidden sm:block text-gray-300">
            Welcome, <span className="text-white font-semibold">{user.firstName}</span>
          </span>

          <div className="dropdown dropdown-end">

            {/* Avatar Button */}
            <label
              tabIndex={0}
              className="btn btn-ghost btn-circle avatar border border-white/20 hover:border-pink-500/40 transition"
            >
              <div className="w-10 rounded-full">
                <img
                  src={user?.photoUrl}
                  alt="avatar"
                  className="object-cover"
                />
              </div>
            </label>

            {/* Dropdown Menu */}
            <ul
              tabIndex={0}
              className="menu menu-sm dropdown-content mt-3 w-44 rounded-2xl backdrop-blur-xl bg-white/5 border border-white/10 shadow-xl p-2 space-y-1"
            >
              <li>
                <Link
                  to="/profile"
                  className="hover:bg-white/10 rounded-lg"
                >
                  Profile
                </Link>
              </li>

              <li>
                <Link
                  to="/connections"
                  className="hover:bg-white/10 rounded-lg"
                >
                  Connections
                </Link>
              </li>

              <li>
                <Link
                  to="/requests"
                  className="hover:bg-white/10 rounded-lg"
                >
                  Requests
                </Link>
              </li>

              <li>
                <button
                  onClick={handleLogout}
                  className="text-red-400 hover:bg-red-500/10 rounded-lg"
                >
                  Logout
                </button>
              </li>
            </ul>

          </div>
        </div>
      )}
    </div>
  );
};

export default NavBar;