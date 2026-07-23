import { useState } from "react";
import UserPreviewCard from "./UserPreviewCard";
import axios from "axios";
import { BASE_URL } from "../utils/constants";
import { useDispatch } from "react-redux";
import { addUser } from "../utils/userSlice";

const EditProfile = ({ user }) => {
  const dispatch = useDispatch();

  const [firstName, setFirstName] = useState(user?.firstName || "");
  const [lastName, setLastName] = useState(user?.lastName || "");
  const [photoUrl, setPhotoUrl] = useState(user?.photoUrl || "");
  const [age, setAge] = useState(user?.age || "");
  const [gender, setGender] = useState(user?.gender || "");
  const [about, setAbout] = useState(user?.about || "");
  const [error, setError] = useState("");
  const [showToast, setShowToast] = useState(false);

  const saveProfile = async () => {
    setError("");

    try {
      const res = await axios.patch(
        BASE_URL + "/profile/edit",
        { firstName, lastName, photoUrl, age, gender, about },
        { withCredentials: true }
      );

      dispatch(addUser(res?.data?.data));
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
    } catch (err) {
      setError(err?.response?.data || "Something went wrong");
    }
  };

  return (
    <div className="min-h-screen flex justify-center py-16 px-6">

      <div className="flex flex-col lg:flex-row gap-16 max-w-6xl w-full">

        {/* ===== Glass Form Card ===== */}
        <div className="w-96 backdrop-blur-md bg-slate-800/40 border border-white/5 rounded-2xl shadow-lg shadow-black/30 p-8 transition duration-300 hover:bg-slate-800/50">

          <h2 className="text-2xl font-bold text-center mb-8 text-white">
            Edit Profile ✨
          </h2>

          <div className="space-y-5">

            {/* First Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">First Name</span>
              </label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className="input bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              />
            </div>

            {/* Last Name */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Last Name</span>
              </label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className="input bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              />
            </div>

            {/* Photo URL */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Photo URL</span>
              </label>
              <input
                type="text"
                value={photoUrl}
                onChange={(e) => setPhotoUrl(e.target.value)}
                className="input bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              />
            </div>

            {/* Age */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Age</span>
              </label>
              <input
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                className="input bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              />
            </div>

            {/* Gender */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">Gender</span>
              </label>
              <select
                value={gender}
                onChange={(e) => setGender(e.target.value)}
                className="select bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              >
                <option value="male" className="bg-slate-900">Male</option>
                <option value="female" className="bg-slate-900">Female</option>
                <option value="confused" className="bg-slate-900">Confused</option>
              </select>
            </div>

            {/* About */}
            <div className="form-control">
              <label className="label">
                <span className="label-text text-gray-400">About</span>
              </label>
              <textarea
                rows="3"
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                className="textarea bg-slate-800/40 border border-white/5 focus:border-pink-500 focus:ring-0 focus:outline-none text-white rounded-xl"
              />
            </div>

            {/* Error */}
            {error && (
              <div className="alert bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl">
                <span>{error}</span>
              </div>
            )}

            {/* Save Button */}
            <button
              onClick={saveProfile}
              className="w-full py-3 rounded-xl bg-linear-to-r from-pink-500 to-purple-600 text-white font-semibold hover:scale-105 transition-all duration-300 shadow-md"
            >
              Save Profile 💾
            </button>

          </div>
        </div>

        {/* ===== Live Card ===== */}
        <UserPreviewCard
          user={{ firstName, lastName, photoUrl, age, gender, about }}
        />

      </div>

      {/* Toast */}
      {showToast && (
        <div className="toast toast-top toast-end">
          <div className="alert bg-green-500/10 border border-green-500/30 text-green-400">
            <span>Profile saved successfully 🎉</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditProfile;