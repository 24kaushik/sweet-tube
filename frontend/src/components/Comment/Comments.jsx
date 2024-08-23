import React from "react";

const Comments = ({ id, type }) => {
  return (
    <div>
      <Comment />
    </div>
  );
};

const Comment = ({id, avatar, username, content, likes}) => {
  return (
    <div className="flex my-1 border-y-2 py-1">
      <div className="min-w-14 max-w-14 mr-1">
        <img
          className="aspect-square"
          src="https://avatars.githubusercontent.com/u/87313991?v=4"
          alt="comment avatar"
        />
      </div>

      <div className="">
      <h4 className="pt-1">@username</h4>
        <p className="leading-4 text-sm pl-2 text-gray-600">
          Lorem, ipsum dolor sit amet consectetur adipisicing elit. Totam ullam
          voluptate unde quis eos accusantium dolor quaerat, delectus velit
          provident. Harum explicabo voluptatibus quibusdam corrupti odio vel
          earum voluptates minus.
        </p>
        <div className="flex flex-wrap">
          <button className="flex justify-center items-center bg-gray-200 rounded-full px-3 py-1 my-1 hover:bg-red-200 text-sm" >
            <i className="fa-regular fa-heart mr-1"></i> 201
          </button>
        </div>
      </div>
    </div>
  );
};

export default Comments;
