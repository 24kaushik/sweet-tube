import React from "react";
import VideoCard from "../Video/VideoCard";

const Home = () => {
  return (
    <div className="w-full min-h-[calc(100vh-4rem)] p-5 flex flex-wrap justify-evenly ">
      <VideoCard />
      <VideoCard />
      <VideoCard />
      <VideoCard />
    </div>
  );
};

export default Home;
