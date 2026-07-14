import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { dummyPostsData, dummyUserData } from "../assets/assets";
import Loading from "../components/Loading";
import UserProfile from "../components/UserProfile";
import PostCard from "../components/PostCard";
import { Link } from "react-router-dom";
import moment from "moment";

const Profile = () => {
  const { profileId } = useParams();
  const [users, setUsers] = useState(null);
  const [activeTab, setActiveTab] = useState([]);
  const [posts, setPosts] = useState("posts");
  const [showedit, setShowEdit] = useState(false);

  const fetchUser = async () => {
    setUsers(dummyUserData);
    setPosts(dummyPostsData);
  };

  useEffect(() => {
    fetchUser();
  }, []);

  return users ? (
    <div className="relative h-full overflow-y-scroll bg-gray-50 p-6">
      <div className="max-w-3xl mx-auto">

        {/* Profile Photo */}
        <div className="bg-white rounded-2xl shadow overflow-hidden ">
          {/* Cover Photo */}
          <div className="h-40 md:h-56 bg-linear-to-r from-indigo-200 via-purple-200 to-pink-200">
            {users.cover_photo && (
              <img
                src={users.cover_photo}
                alt=""
                className="w-full h-full object-cover"
              />
            )}
          </div>
          {/* User Info */}
          <UserProfile users={users} posts={posts} profileId={profileId} setShowEdit={setShowEdit}/>

          {/* Tabs */}
          <div className="mt-6">
            <div className="bg-white rounded-xl shadow p-1 flex max-w-md mx-auto">
              {["posts", "media", "likes"].map((tab) => (
                <button
                  onClick={() => setActiveTab(tab)}
                  key={tab}
                  className={`flex-1  px-4 py-2 text-sm font-medium rounded-lg transition-colors cursor-pointer ${activeTab === tab ? "bg-indigo-600 text-white" : "text-gray-600 hover:text-gray-900"}`}
                >
                  {tab.charAt(0).toUpperCase() + tab.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* posts */}
          {activeTab === "posts" && (
            <div className="mt-6 flex flex-col items-center gap-6">
              {posts.map((post) => (
                <PostCard key={post} post={post} />
              ))}
            </div>
          )}

          {/* media */}
          {activeTab === "media" && (
            <div className="mt-6 flex flex-wrap max-w-6xl">
              {posts
                .filter((post) => post.image_urls.length > 0)
                .map((post) => (
                  <>
                    {post.image_urls.map((image, index) => (
                      <Link
                        target="_blank"
                        to={image}
                        key={index}
                        className="relative group"
                      >
                        <img
                          src={image}
                          alt=""
                          key={index}
                          className="w-64 aspect-video object-cover"
                        />
                        <p className="absolute bottom-0 right-0 text-xs p-1 px-3 backdrop-blur-xl text-white opacity-0 group-hover:opacity-300 transition duration-300">
                          Posted {moment(post.createdAt).fromNow()}
                        </p>
                      </Link>
                    ))}
                  </>
                ))}
            </div>
          )}
        </div>
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Profile;
