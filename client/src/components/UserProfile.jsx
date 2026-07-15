import { Calendar, MapPin, PenBox, Verified } from "lucide-react";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import ProfileModal from "./ProfileModal";

const UserProfile = ({ users, posts, profileId, setShowEdit }) => {

    const navigate = useNavigate();

  return (
    <div className="relative py-4 px-6 md:px-8 bg-white ">
      <div className="flex flex-col md:flex-row items-start gap-6">
        <div className="w-32 h-32 border-4 border-white shadow-lg absolute -top-16 rounded-full">
          <img
            src={users.profile_picture}
            alt=""
            className="absolute rounded-full z-2 hover:scale-105 transition-transform duration-300 ease-in-out w-full h-full object-cover"
          />
        </div>
        <div className="w-full pt-16 md:pt-0 md:pl-36">
          <div className="flex flex-col md:flex-row items-start justify-between">
            <div>
              <div className="flex items-center gap-3">
                <h1 className="text-2xl font-bold text-gray-900">
                  {users.full_name}
                </h1>
                <Verified className="w-6 h-6 text-blue-500" />
              </div>
              <p className="text-gray-600">
                {users.username ? `@${users.username}` : "Add a username"}
              </p>
            </div>

            {/* if user is not present which means that he is opening his own id and we add edit button */}
            {!profileId && (
              <button
                className="flex items-center gap-2 border border-gray-300 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium transition-colors mt-4 md:mt-0 cursor-pointer hover:scale-105"
                onClick={() => {
                  setShowEdit(true);
  
                }}
              >
                <PenBox className="w-4 h-4" />
                Edit{" "}
              </button>
            )}
          </div>

          <p className="text-gray-700 text-sm max-w-md mt-4">{users.bio}</p>

          <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-gray-500 mt-4 ">
            <span className="flex items-center gap-1.5">
              <MapPin />
              {users.location ? users.location : "Add location"}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              Joined <span>{moment(users.createdAt).fromNow()}</span>
            </span>
          </div>

          <div className="flex flex-1 items-center justify-evenly border-t border-gray-400 gap-6 mt-6 pt-4">
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {posts.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Posts
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {users.followers.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Followers
              </span>
            </div>
            <div>
              <span className="sm:text-xl font-bold text-gray-900">
                {users.following.length}
              </span>
              <span className="text-xs sm:text-sm text-gray-500 ml-1.5">
                Following
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfile;
