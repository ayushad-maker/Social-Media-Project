import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { assets, dummyPostsData } from "../assets/assets";
import StoriesBar from "../components/StoriesBar";
import PostCard from "../components/PostCard";
import RecentMessages from "../components/RecentMessages";

const Feed = () => {
  const [feedData, setFeedData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchFeeds = async () => {
    setFeedData(dummyPostsData);
    setLoading(false);
  };

  useEffect(() => {
    fetchFeeds();
  }, []);

  return !loading ? (
    <div className="h-full overflow-y-scroll no-scrollbar py-10 xl:pr-5 flex items-start justify-center xl:gap-8">
      {/* stories and post */}
      <div>
        <StoriesBar />
        <div className="p-6 space-y-6">
          {feedData.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}
        </div>
      </div>

      {/* Right Sidebar */}
      <div className="max-xl:hidden sticky top-0">
        <div className="max-w-xs bg-white text-xs p-4 rounded-md inline-flex flex-col gap-2 shadow ">
          <h3>Sponsored</h3>
          <img
            src={assets.sponsored_img}
            alt=""
            className="w-75 h-50 rounded-md "
          />
          <p className="text-slate-600">Email Marketing</p>
          <p>SuperCharge your marketing with a powerful,easy-to-use platform for results.</p>
        </div>
         <RecentMessages />
      </div>
    </div>
  ) : (
    <Loading />
  );
};

export default Feed;
