import { dummyUserData } from "../assets/assets";
import { MapPin, MessageCircle, Plus, UserPlus } from "lucide-react";

const UserCard = ({ user }) => {
  const currentUser = dummyUserData;

  const handleFollow = async () => {};

  const handleConnectionRequest = async () => {};

  return (
    <>
      <div
        key={user._id}
        className="p-4 pt-6 flex flex-col justify-between w-72 shadow border border-gray-400 rounded-md"
      >
        <div className="text-center">
          <img
            src={user.profile_picture}
            alt=""
            className="rounded-full w-16 shadow-md mx-auto border border-white hover:scale-105 cursor-pointer"
          />
          <p className="mt-4 font-semibold">{user.full_name}</p>
          {user.username && (
            <p className="text-gray-800 font-light">@{user.username}</p>
          )}
          {user.bio && (
            <p className="text-black mt-2 text-center text-sm px-4">
              {user.bio}
            </p>
          )}

          <div className="flex items-center justify-between gap-2 mt-4 text-xs text-gray-600">
            <div className="flex items-center gap-1 border border-gray-500 rounded-full px-3 py-1">
              <MapPin className="w-4 h-4 text-black" />
              {user.location}
            </div>
            <div className="flex items-center gap-1 border border-gray-500 rounded-full px-3 py-1">
              {user.followers && user.followers.length > 0 ? (
                <p className="text-slate-600">
                  {user.followers.length} followers
                </p>
              ) : (
                <p className="text-slate-600">No followers yet</p>
              )}
            </div>
          </div>

          <div className="flex mt-4 gap-2">
            {/* Follow Button */}
            <button
              onClick={handleFollow}
              disabled={currentUser?.following.includes(user._id)}
              className="w-full py-2 rounded-md flex justify-center items-center gap-2 bg-linear-to-r from-indigo-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:scale-95 transition text-white cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              {currentUser?.following.includes(user._id)
                ? "Following"
                : "Follow"}
            </button>

            {/* Connection Request Button/ Message Button */}
            <button
              onClick={handleConnectionRequest}
              disabled={currentUser?.connections.includes(user._id)}
              className="flex items-center justify-center w-16 border text-slate-500 group border-black rounded-md cursor-pointer active:scale-95 transition"
            >
              {currentUser?.connections.includes(user._id) ? (
                <MessageCircle className="w-5 h-5 group-hover:scale-105 transition text-black font-semibold" />
              ) : (
                <Plus className="w-5 h-5 group-hover:scale-110 transition text-black font-semibold" />
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserCard;
