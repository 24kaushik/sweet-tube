import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../Video/VideoPlayer";
import Comments from "../Comment/Comments";

const Theater = () => {
  const params = useParams();
  const [isChecked, setIsChecked] = useState(null);
  const descArrowRef = useRef(null);
  const descRef = useRef(null);
  useEffect(() => {
    if (isChecked !== null) {
      descArrowRef.current.classList.toggle("rotate-180");
      descRef.current.classList.toggle("h-0");
    }
  }, [isChecked]);
  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <VideoPlayer invalidVid={true} />
      <div className="flex text-gray-700">
        <div>
          <p className="px-3 pt-2 text-xl leading-6 font-medium">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Nostrum
            mollitia cumque doloribus repellendus consequatur dolorum libero
            perspiciatis pariatur praesentium.
          </p>

          <div className="flex space-x-6 mx-5 text-gray-600 text-base font-normal">
            <div>3.4k views</div>
            <div>1 month ago</div>
          </div>
        </div>

        <div className="mr-3 flex items-center justify-center">
          <label htmlFor="descCheck" className="cursor-pointer">
            <i
              ref={descArrowRef}
              className="fa-solid fa-angle-down fa-2xl transition-all"
            ></i>
            <input
              className="hidden"
              type="checkbox"
              name="descCheck"
              id="descCheck"
              onClick={(e) => setIsChecked(e.target.checked)}
            />
          </label>
        </div>
      </div>
      <div className="overflow-hidden h-0" ref={descRef}>
        <hr className="border-1 mx-3 border-gray-400"/>
        <h2 className="text-2xl ml-4">Description:</h2>
        <p className="mx-6 mb-3 text-gray-600">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Recusandae
          numquam ad distinctio, nihil laudantium asperiores nulla culpa earum
          neque veritatis ullam dolorem exercitationem nostrum quasi minus est
          facilis voluptas voluptatem.
        </p>
      </div>

      <hr className="border-2 mx-2 rounded-full border-gray-300" />

      <div className="flex px-4 my-2 space-x-2 flex-wrap">
        <button className="flex justify-center items-center bg-gray-300 rounded-full px-4 py-1 my-1 hover:bg-red-200">
          <i className="fa-regular fa-heart mr-1"></i> 201
        </button>
        <button className="flex justify-center items-center bg-gray-300 rounded-full px-4 py-1 my-1 hover:bg-gray-400">
          <i className="fa-regular fa-plus mr-1 font-bold"></i> Add to playlist
        </button>
        <button className="flex justify-center items-center bg-gray-300 rounded-full px-4 py-1 my-1 hover:bg-gray-400">
          <i className="fa-regular fa-copy mr-1"></i> Copy link
        </button>
      </div>
      <div className="flex mx-2 items-center justify-between md:justify-normal">
        <div className="flex items-center">
          <img
            className="w-16 h-16"
            src="https://avatars.githubusercontent.com/u/87313991?v=4"
            alt="channel logo"
          />
          <div className="leading-4 ml-1">
            <div className="leading-3">Kaushik Sarkar</div>
            <div className="text-xs leading-4 text-gray-500">@kaushik</div>
            <div className="text-sm leading-3">1.4M Subscribers</div>
          </div>
        </div>
        <div>
          <button className="bg-red-600 text-white px-3 py-1 text-lg rounded-full mr-2 md:ml-6">
            Subscribe
          </button>
        </div>
      </div>

      <hr className="border-2 mx-2 m-2 rounded-full border-gray-300" />

      <div className="my-3 mx-2">
        <h2 className="text-3xl">Comments:</h2>
        <form className="my-3 flex space-x-2">
          <textarea
            type="text"
            id="comment"
            className="w-3/4 md:w-5/6 lg:w-11/12 bg-gray-50 border-4 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-400 focus:border-4 block px-2 py-1.5 outline-none h-12"
            placeholder="Say something..."
            required
          />
          <button className="bg-red-500 text-white w-1/4 md:w-1/6 lg:w-1/12 rounded-lg text-lg hover:bg-red-600 h-12 ">
            Comment
          </button>
        </form>
        <div>
          <Comments />
        </div>
      </div>
    </div>
  );
};

// Like button: bg-red-200, text-red-500, fa-solid

export default Theater;
