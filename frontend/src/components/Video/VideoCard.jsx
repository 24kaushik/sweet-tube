import React from "react";
import { Link } from "react-router-dom";
import { calcUploadTime } from "../../utils/timeCalculator";

const VideoCard = ({
  id,
  title,
  thumbnail,
  duration,
  views,
  owner,
  createdAt,
}) => {
  const calculateDuration = (dur) => {
    const time = Math.floor(dur);
    const minutes = Math.floor(time / 60);
    const seconds = time % 60;
    return `${minutes}:${seconds.toString().padStart(2, "0")}`;
  };
  return (
    <Link to={`/watch/${id}`}>
      <div className="max-w-sm my-2 bg-white border border-gray-200 rounded-lg shadow cursor-pointer dark:bg-gray-800 dark:border-gray-700 hover:shadow-lg hover:scale-[101%] transition-all">
        <div className="relative">
          <img
            className="rounded-t-lg aspect-video"
            src={thumbnail}
            alt="thumbnail"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-85 text-white text-sm px-2 rounded">
            {calculateDuration(duration)}
          </div>
        </div>
        <div className="p-1 flex h-[3.6rem]">
          <div className="w-[14%] p-1">
            <img
              className="rounded-full aspect-square"
              src={owner.avatar}
              alt="avatar"
            />
          </div>
          <div className="w-10/12 flex flex-col justify-center">
            <div className="max-h-4/6 leading-none px-2 flex items-center overflow-hidden">
              <p className="line-clamp-2">{title}</p>
            </div>
            <div className="h-2/6 leading-none text-sm px-2 pt-0.5 flex text-gray-600">
              <div className="w-1/3">@{owner.username}</div>
              <div className="w-1/3">{views} views</div>
              <div className="w-1/3">{calcUploadTime(createdAt)}</div>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default VideoCard;
