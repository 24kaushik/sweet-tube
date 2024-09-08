import React from "react";
import { calculateDuration } from "../../utils/timeCalculator";

const VideoList = () => {
  const title =
    "Lorem ipsum dolor sit, amet consectetur adipisicing elit. Veniam autem dignissimos placeat, quam temporibus praesentium modi quasi ipsam dolore esse debitis excepturi, eaque quia id? Laboriosam accusantium maxime nisi? Nihil dolorum repudiandae, ex voluptate dolorem officia assumenda optio veritatis officiis soluta! Magni quibusdam voluptates praesentium recusandae enim! Possimus eligendi rem nihil iste quod nostrum, eum perferendis, veritatis deserunt assumenda voluptatibus?";
  return (
    <div className="h-24 sm:h-32 md:h-36 lg:h-48 rounded-lg my-4 bg-gray-50 drop-shadow-md flex border border-gray-200">
      <div className="h-full aspect-video relative ">
        <img
          src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSt1IgIUzbvxkidENOl2DQWSuwx4o3snyBbKg&usqp=CAU"
          className="h-full rounded-l-lg w-full"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-85 text-white text-sm text-center px-2 rounded-sm">
          {calculateDuration(200)}
        </div>
      </div>

      <div className="p-1.5 md:p-2">
        <div className="leading-4 text-[.94rem] sm:text-lg line-clamp-3 lg:text-xl ">
          {title}
        </div>
        <div className="text-sm text-gray-500 pt-1 sm:text-base">
          <span>2.4k views</span>
          <span>&nbsp;&nbsp; &#8226; &nbsp;&nbsp;</span>
          <span>1 month ago</span>
        </div>
      </div>
    </div>
  );
};

export default VideoList;
