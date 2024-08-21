import React, { useEffect, useState } from "react";
import VideoCard from "../Video/VideoCard";
import InfiniteScroll from "react-infinite-scroll-component";

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

const EndMessage = () => {
  return (
    <div className="text-center text-gray-400 mb-5">
      Congrats!, youv'e reached the end.
    </div>
  );
};

const Loader = () => {
  return (
    <div className="mb-5 flex w-full items-center justify-center">
      <div className="w-10 h-10 border-t-[.5em] border-b-[.5em] border-[.5em] border-t-red-400 border-b-red-400 rounded-full animate-spin"></div>
    </div>
  );
};

export default Home;
