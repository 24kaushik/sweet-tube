import React, { useEffect, useState } from "react";
import VideoCard from "../Video/VideoCard";
import InfiniteScroll from "react-infinite-scroll-component";
import Loader from "../Loader/Loader";
import EndMessage from "../Loader/EndMessage";

const Home = () => {
  const [page, setPage] = useState(1);
  const [videoList, setVideoList] = useState([]);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    const myFunc = async () => {
      const resp = await fetch(
        `${import.meta.env.VITE_BACKEND}/videos/?page=${page}&limit=10&sortType=desc&sortBy=createdAt`
      );
      const data = await resp.json();
      setVideoList(videoList.concat(data.data.docs));
      setHasMore(data.data.hasNextPage);
    };
    myFunc();
  }, []);

  const fetchData = async () => {
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND}/videos/?page=${page + 1}&limit=10&sortType=desc&sortBy=createdAt`
    );
    setPage(page + 1);
    const data = await resp.json();
    setVideoList(videoList.concat(data.data.docs));
    setHasMore(data.data.hasNextPage);
  };

  return (
    <div>
      <InfiniteScroll
        dataLength={videoList.length}
        next={fetchData}
        hasMore={hasMore}
        loader={videoList.length ? <Loader /> : <></>}
        endMessage={<EndMessage />}
      >
        <div className="w-full min-h-[calc(100vh-4rem)] p-5 flex flex-wrap justify-evenly ">
          {!videoList.length ? <Loader /> : <></>}
          {videoList.map((video) => (
            <VideoCard
              key={video._id}
              id={video._id}
              videoFile={video.videoFile}
              title={video.title}
              thumbnail={video.thumbnail}
              duration={video.duration}
              views={video.views}
              owner={video.owner}
              createdAt={video.createdAt}
            />
          ))}
        </div>
      </InfiniteScroll>
    </div>
  );
};


export default Home;
