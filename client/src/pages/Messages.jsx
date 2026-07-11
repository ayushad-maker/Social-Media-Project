import { useNavigate } from "react-router-dom";
import { dummyConnectionsData } from "../assets/assets";
import { Eye, MessageSquare } from "lucide-react";

const Messages = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen relative bg-slate-50">
      <div className="max-w-6xl mx-auto p-6 ">
        <div className="mb-8 ml-5">
          <h1 className="text-3xl font-bold text-slate-900 mt-2 ">Messages</h1>
          <p className="text-slate-600">Talk to your friends and family</p>
        </div>

        {/* Connected User */}
        <div className="flex flex-col gap-15 ml-2">
          {dummyConnectionsData.map((user) => (
            <div
              key={user._id}
              className="max-w-xl flex flex-wrap gap-5 p-6 bg-slate-100 shadow rounded-md"
            >
              <img
                src={user.profile_picture}
                alt=""
                className="rounded-full size-12 mx-auto border-blue-400 hover:scale-105 shadow object-cover"
              />
              <div className="flex-1">
                <p className="font-medium text-slate-700 underline">
                  {user.full_name}
                </p>
                <p className="font-medium text-blue-400 cursor-pointer">
                  @{user.username}
                </p>
                <p className="text-sm text-slate-700">{user.bio}</p>
              </div>

              <div className="flex flex-col items-center justify-center gap-3">
                <button
                  onClick={() => navigate(`/messages/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-200 hover:bg-slate-300 hover:scale-105 text-slate-800 transition cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                </button>

                <button
                  onClick={() => navigate(`/profile/${user._id}`)}
                  className="size-10 flex items-center justify-center text-sm rounded bg-slate-200 hover:bg-slate-300 hover:scale-105 text-slate-800 transition cursor-pointer"
                >
                  <Eye className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Messages;
