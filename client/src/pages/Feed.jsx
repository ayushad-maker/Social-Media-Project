import { useEffect, useState } from "react";
import Loading from "../components/Loading";
import { dummyPostsData } from "../assets/assets";
import StoriesBar from "../components/StoriesBar";

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

  return !loading ? 
  <div>
    {/* stories and post */ }
    <div>
      <StoriesBar />
      <div>
        <h1>list of stories</h1>
      </div>
    </div>

    {/*  */}
    
  </div> : <Loading />;
};

export default Feed;
