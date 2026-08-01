import { useEffect, useState } from "react";
import { MapPin, Search } from "lucide-react";
import UserCard from "../components/UserCard";
import Loading from "../components/Loading";
import toast from "react-hot-toast";
import { useAuth } from "@clerk/react";
import api from "../api/axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../features/user/userSlice";

const Discover = () => {
  const dispatch = useDispatch();
  const [input, setInput] = useState("");
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const {getToken} = useAuth();

  const handleSearch = async (e) => {
    if (e.key === "Enter") {
      try {
        setUser([]);
        setLoading(true);
        const token = await getToken();
        const { data } = await api.post(
          "/api/user/discover",
          { input },
          { headers: { Authorization: `Bearer ${token}` } },
        );
        if (data.success) {
          toast.success(data.message);
          setUser(data.users);
          setLoading(false);
          setInput("");
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        console.log(error);
        toast.error(error.message);
      }
      setLoading(false);
    }
  };

  useEffect(() => {
    getToken().then((token) => {
      dispatch(fetchUser(token));
    });
  }, []);

  return (
    <div className="min-h-screen bg-linear-to-b from-slate-50 to-gray-100">
      <div className="max-w-6xl mx-auto p-6">
        {/* Title */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            Discover People
          </h1>
          <p className="text-slate-600">
            connect with amazing people and grow your network
          </p>
        </div>

        {/* Search */}
        <div className="mb-8 shadow-md rounded-md border border-slate-200/60  bg-white/20">
          <div className="p-6">
            <div className="relative">
              <Search className="absolute left-3 top-3 transform -tracking-y-1/2 text-slate-400 w-5 h-5" />
              <input
                type="text"
                placeholder="search people by name, username,bio,or location..."
                className="pl-10 sm:pl-12 py-2 w-full border border-gray-300 rounded-md max-sm:text-sm"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleSearch}
                value={input}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-6">
          {user.map((users) => (
            <UserCard user={users} key={users._id} />
          ))}
        </div>

        {loading && (
          <div className="flex justify-center items-center mt-6">
            <Loading className="height-60vh" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Discover;
