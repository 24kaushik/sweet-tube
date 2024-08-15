import React from "react";

const VideoCard = () => {
  return (
    <div>
      <div className="max-w-sm my-2 bg-white border border-gray-200 rounded-lg shadow dark:bg-gray-800 dark:border-gray-700">
        <div className="relative">
          <img
            className="rounded-t-lg aspect-video"
            src="https://flowbite.com/docs/images/blog/image-1.jpg"
            alt="thumbnail"
          />
          <div className="absolute bottom-2 right-2 bg-black bg-opacity-85 text-white text-sm px-2 rounded">
            3:32
          </div>
        </div>
        <div className="p-1 flex h-[3.6rem]">
          <div className="w-[14%] aspect-square">
            <img
              src="https://avatars.githubusercontent.com/u/87313991?v=4"
              alt=""
            />
          </div>
          <div className="w-10/12">
            <div className="h-4/6 leading-none px-2 flex items-center overflow-hidden">
              <p className="line-clamp-2">
                Lorem ipsum dolor sit amet consectetur adipisicing elit. Odit
                sapiente minima neque quisquam exercitationem ut assumenda
                debitis. Voluptatibus nostrum odio ea nam eius ex tempora rem
                ad, dolor maxime aliquam.
              </p>
            </div>
            <div className="h-2/6 leading-none text-sm px-2 pt-0.5 flex text-gray-600">
              <div className="w-1/3">@username</div>
              <div className="w-1/3">2.3k views</div>
              <div className="w-1/3">1 month ago</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
