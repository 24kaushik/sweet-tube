import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import EndMessage from "../Loader/EndMessage";
import Loader from "../Loader/Loader";
import { calcUploadTime } from "../../utils/timeCalculator";

const Comments = ({ id, type = "video", trigger }) => {
  const [comments, setComments] = useState([]);
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  // useEffect(() => {
  //   const fetchComments = async () => {
  //     if (id) {
  //       const response = await fetch(
  //         `${import.meta.env.VITE_BACKEND}/comments/${type === "video" ? "v" : "p"}/${id}?page=1&limit=10`
  //       );
  //       const data = await response.json();
  //       if(data.success)
  //     }
  //   };
  //   fetchComments();
  // }, []);

  const fetchData = async (refetch) => {
    if(refetch){
      setPage(0);
      setHasMore(true)
      setComments([])
    }
    const resp = await fetch(
      `${import.meta.env.VITE_BACKEND}/comments/${type === "video" ? "v" : "p"}/${id}?page=${page + 1}&limit=10`
    , {
      method: "get",
      credentials: "include"
    });
    setPage(page + 1);
    const data = await resp.json();
    setComments(comments.concat(data.data.docs));
    setHasMore(data.data.hasNextPage);
  };

  useEffect(()=>{
    fetchData(true);
  },[trigger])

  return (
    <div>
      <InfiniteScroll
        dataLength={comments.length}
        next={fetchData}
        hasMore={hasMore}
        loader={comments.length ? <Loader /> : <></>}
        endMessage={<EndMessage />}
      >
        {comments.map((comment) => (
          <Comment
            key={comment._id}
            id={comment._id}
            content={comment.content}
            likesCount={comment.likesCount}
            userHasLiked={comment.userHasLiked}
            owner={comment.owner}
            createdAt={comment.createdAt}
          />
        ))}
      </InfiniteScroll>
    </div>
  );
};

const Comment = ({ id, owner, content, likesCount, userHasLiked, createdAt }) => {
  const [likes, setLikes] = useState(likesCount);
  const [hasLiked, setHasLiked] = useState(userHasLiked);

  const handleLike = () => {
    fetch(`${import.meta.env.VITE_BACKEND}/likes/toggle/c/${id}`, {
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

  return (
    <div className="flex my-1 border-y-2 py-1">
      <div className="min-w-14 max-w-14 mr-1 flex justify-center items-center">
        <img
          className="aspect-square rounded-full"
          src={owner?.avatar}
          alt="comment avatar"
        />
      </div>

      <div className="">
        <h4 className="pt-1">@{owner?.username} &nbsp;&nbsp; &#8226; &nbsp;&nbsp; <span className="text-base text-gray-500">{calcUploadTime(createdAt)}</span></h4>
        <p className="leading-4 text-sm pl-2 text-gray-600">{content}</p>
        <div className="flex flex-wrap">
          <button
            className={`scale-95 flex justify-center items-center ${hasLiked ? "bg-red-200 text-red-500" : "bg-gray-300"} rounded-full px-2 py-0.5 my-1 hover:bg-red-200`}

            onClick={handleLike}
          >
            <i
              className={`fa-regular fa-sm fa-heart mr-1 ${hasLiked ? "fa-solid" : ""}`}
            ></i>{" "}
            {likes}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
