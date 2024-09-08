import React, { useState } from "react";

const PostCard = ({ id, content, likes, comments, image }) => {
  const [hasLiked, setHasLiked] = useState(false);
  return (
    <div>
      <div className="max-w-sm m-2 bg-white border border-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer hover:outline outline-1 outline-gray-300 transition-all dark:bg-gray-800 dark:border-gray-700">
        <img
          className="rounded-t-lg aspect-video"
          src="https://flowbite.com/docs/images/blog/image-1.jpg"
          alt=""
        />

        <div className="p-5">
          <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quas aut
            labore sunt? Architecto repellat molestias sed dignissimos culpa
            beatae tempore?
          </p>
          <div className="flex text-gray-600">
            <button
              className={`w-1/3 flex justify-center items-center ${hasLiked ? "text-red-500" : ""} px-4 py-1 my-1 hover:text-red-500`}
            >
              <i
                className={`fa-regular fa-heart mr-2 ${hasLiked ? "fa-solid" : ""}`}
              />
              <span>33</span>
            </button>

            <button
              className={`w-1/3 flex justify-center items-center px-4 py-1 my-1 hover:text-black `}
            >
              <i className={`fa-regular fa-message mr-2`} />
              <span>33</span>
            </button>

            <button className="w-1/3 flex justify-center items-center px-4 py-1 my-1 hover:text-black">
              <i className="fa-regular fa-copy mr-2"></i>
              <span className="text-sm">Link</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard;
