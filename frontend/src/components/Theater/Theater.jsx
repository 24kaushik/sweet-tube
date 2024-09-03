import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import VideoPlayer from "../Video/VideoPlayer";
import Comments from "../Comment/Comments";

const Theater = () => {
  //TODO: Make add to playlist and subscribe btn working. also hyperlink to channel
  //TODO: Alert user to login if some action requires login

  // variable initialization
  const { videoId } = useParams();
  const [isChecked, setIsChecked] = useState(null);
  const descArrowRef = useRef(null);
  const descRef = useRef(null);
  const [videoData, setVideoData] = useState({});
  const [invalidVid, setInvalidVid] = useState(false);
  const [privateVid, setPrivateVid] = useState(false);
  const [likes, setLikes] = useState(0);
  const [hasLiked, setHasLiked] = useState(false);
  const [commentData, setCommentData] = useState("");
  const [trigger, setTrigger] = useState(true);

  // UseEffects
  useEffect(() => {
    if (isChecked !== null) {
      descArrowRef.current.classList.toggle("rotate-180");
      descRef.current.classList.toggle("h-0");
    }
  }, [isChecked]);

  useEffect(() => {
    const func = async () => {
      //************* TEMP LOGIN **********//
      // await fetch(`${import.meta.env.VITE_BACKEND}/users/login`, {
      //   method: "POST",
      //   headers: {
      //     "Content-Type": "application/json",
      //   },
      //   body: JSON.stringify({
      //     username: "nigga",
      //     password: "12345678",
      //   }),
      //   credentials: "include",
      // });
      //***********************************//

      const response = await fetch(
        `${import.meta.env.VITE_BACKEND}/videos/${videoId}`,
        {
          credentials: "include",
        }
      );
      const data = await response.json();
      if (data.statusCode == 200) {
        setVideoData(data.data);
        setLikes(data.data.likesCount);
        setHasLiked(data.data.userHasLiked);
      } else if (data.statusCode == 401) {
        setPrivateVid(true);
      } else {
        setInvalidVid(true);
      }
    };
    func();
  }, []);

  // Functions / handlers
  const handleLike = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/likes/toggle/v/${videoId}`, {
      credentials: "include",
      method: "POST",
    })
      .then(async (response) => await response.json())
      .then((data) => {
        if (data.statusCode == 200) {
          if (hasLiked) {
            setLikes(likes - 1);
          } else {
            setLikes(likes + 1);
          }
          setHasLiked(!hasLiked);
        }
      });
  };

  const handleCopy = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
    } catch (err) {
      console.log(err);
    }
  };

  const handleCommentChange = (e) => {
    setCommentData(e.target.value);
  };

  const handleComment = async (elem) => {
    elem.preventDefault();
    if (commentData?.trim()?.length) {
      await fetch(`${import.meta.env.VITE_BACKEND}/comments/v/${videoId}`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ content: commentData.trim() }),
      });
      setCommentData("");
      setTrigger(!trigger);
    }
  };


  return (
    <div className="bg-gray-50 min-h-[calc(100vh-4rem)]">
      <div>
        {(videoData._id || privateVid || invalidVid) && (
          <VideoPlayer
            videoURL={videoData.videoFile}
            invalidVid={invalidVid}
            privateVid={privateVid}
          />
        )}
      </div>
      <div className="min-h-[4.5rem]">
        <div className="flex text-gray-700 ">
          <div className="w-11/12">
            <p className="px-3 pt-2 text-xl leading-6 font-medium min-h-10">
              {videoData.title}
            </p>

            <div className="flex space-x-6 mx-5 text-gray-600 text-base font-normal">
              <div>{videoData.views} views</div>
              <div>1 month ago</div>
            </div>
          </div>

          <div className="mr-3 flex items-center justify-center w-1/12">
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

        <div className="overflow-hidden h-0 mt-2" ref={descRef}>
          <hr className="border-1 mx-3 my-3 border-gray-400" />
          <h2 className="text-2xl ml-4">Description:</h2>
          <p className="mx-6 mb-3 text-gray-600">{videoData.description}</p>
        </div>
      </div>

      <hr className="border-2 mx-2 rounded-full border-gray-300" />

      <div className="flex px-4 my-2 space-x-2 flex-wrafa-solidp">
        <button
          className={`flex justify-center items-center ${hasLiked ? "bg-red-200 text-red-500" : "bg-gray-300"}  rounded-full px-4 py-1 my-1 hover:bg-red-200`}
          onClick={handleLike}
        >
          <i
            className={`fa-regular fa-heart mr-1 ${hasLiked ? "fa-solid" : ""}`}
          ></i>{" "}
          {likes}
        </button>
        <button className="flex justify-center items-center bg-gray-300 rounded-full px-4 py-1 my-1 hover:bg-gray-400">
          <i className="fa-regular fa-plus mr-1 font-bold"></i> Add to playlist
        </button>
        <button
          onClick={handleCopy}
          className="flex justify-center items-center bg-gray-300 rounded-full px-4 py-1 my-1 hover:bg-gray-400"
        >
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
            <div className="leading-3">{videoData.owner?.fullName}</div>
            <div className="text-xs leading-4 text-gray-500">
              @{videoData.owner?.username}
            </div>
            <div className="text-sm leading-3">
              {videoData.owner?.subscribersCount} Subscribers
            </div>
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
        <form className="my-3 flex space-x-2" onSubmit={handleComment}>
          <textarea
            type="text"
            id="comment"
            className="w-3/4 md:w-5/6 lg:w-11/12 bg-gray-50 border-4 border-gray-300 text-gray-900 rounded-lg focus:ring-blue-500 focus:border-blue-400 focus:border-4 block px-2 py-1.5 outline-none h-12"
            placeholder="Say something..."
            onChange={handleCommentChange}
            value={commentData}
            required
          />
          <button
            type="submit"
            className="bg-red-500 text-white w-1/4 md:w-1/6 lg:w-1/12 rounded-lg text-lg hover:bg-red-600 h-12 "
          >
            Comment
          </button>
        </form>
        <div className="md:mx-2">
          {videoData._id && <Comments id={videoData._id} type="video" trigger={trigger} />}
        </div>
      </div>
    </div>
  );
};

export default Theater;
