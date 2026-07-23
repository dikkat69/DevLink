const UserPreviewCard = ({ user }) => {
  const { firstName, lastName, gender, age, photoUrl, about } = user;

  return (
    <div className="w-80 h-[500px] flex flex-col bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl overflow-hidden">

      {/* Image */}
      <div className="relative w-full h-3/4 overflow-hidden">
        <img
          src={photoUrl || "https://via.placeholder.com/400"}
          alt="Profile"
          className="absolute inset-0 w-full h-full object-cover"
        />

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

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

      {/* Bio */}
      <div className="p-4">
        <p className="text-sm text-gray-300">
          {about || "No bio provided yet."}
        </p>
      </div>
    </div>
  );
};

export default UserPreviewCard;