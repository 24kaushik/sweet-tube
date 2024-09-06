import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";

const BottomBar = () => {
  const [isChecked, setIsChecked] = useState(null);
  const barsRef = useRef(null);
  const crossRef = useRef(null);
  const menuRef = useRef(null);
  const createRef = useRef(null);
  useEffect(() => {
    if (isChecked !== null) {
      barsRef.current.classList.toggle("rotate-180");
      barsRef.current.classList.toggle("opacity-0");
      crossRef.current.classList.toggle("rotate-180");
      crossRef.current.classList.toggle("opacity-100");
      menuRef.current.classList.toggle("opacity-0");
      menuRef.current.classList.toggle("w-0");
      menuRef.current.classList.toggle("w-[22rem]");
      createRef.current.classList.toggle("translate-y-20");
      createRef.current.classList.toggle("opacity-0");
    }
  }, [isChecked]);

  return (
    <div className="fixed z-40 bottom-5 left-1/2 transform -translate-x-1/2 cursor-pointer">
      <label htmlFor="bars">
        <div className="relative z-10 h-[4.3rem] aspect-square bg-gray-50 shadow drop-shadow-md rounded-full flex items-center justify-center cursor-pointer">
          <i
            ref={barsRef}
            className="fa-solid fa-bars fa-2xl text-red-500 transition-all duration-200"
          ></i>
          <i
            ref={crossRef}
            className="fa-solid fa-xmark fa-2xl opacity-0 absolute top-1/2 left-1/2 transform -translate-x-1/2 text-red-500 transition-all duration-200"
          ></i>
          <input
            className="hidden"
            type="checkbox"
            name="bars"
            id="bars"
            onClick={(e) => setIsChecked(e.target.checked)}
          />
        </div>
      </label>
      <div
        ref={menuRef}
        className="absolute top-1/2 h-14 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[9] transition-all rounded-full bg-gray-50 shadow drop-shadow-md flex items-center justify-between opacity-0 duration-200 w-0 overflow-hidden text-red-500"
      >
        <div className="flex mx-7 space-x-4 -mb-4">
          <Link to="/">
            <div className="flex flex-col items-center justify-center space-y-2">
              <i className="fa-solid fa-house fa-xl"></i>
              <p className="text-sm">Home</p>
            </div>
          </Link>
          <div className="flex flex-col items-center justify-center space-y-2">
            <i className="fa-brands fa-youtube fa-2xl scale-90 translate-y-px"></i>
            <p className="text-sm">Subs.</p>
          </div>
        </div>
        <div className="flex mx-7 space-x-4 -mb-4">
          <div className="flex flex-col items-center justify-center space-y-2">
            <i className="fa-solid fa-list-ul fa-xl"></i>
            <p className="text-sm">Playlist</p>
          </div>
          <div className="flex flex-col items-center justify-center space-y-2">
            <i className="fa-solid fa-clock-rotate-left fa-xl"></i>
            <p className="text-sm">History</p>
          </div>
        </div>
      </div>
      <div
        ref={createRef}
        className="absolute z-[9] -top-36 left-1/2 transform -translate-x-1/2 text-center text-red-500 flex flex-col space-y-3 p-2 overflow-hidden transition-all duration-200 opacity-0 translate-y-20"
      >
        <div className="bg-gray-50 shadow drop-shadow-md rounded-full aspect-square w-14 flex flex-col items-center justify-center">
          <i className="fa-regular fa-plus fa-xl font-bold"></i>
          <p className="-mb-4 mt-1 text-sm">Post</p>
        </div>
        <div className="bg-gray-50 shadow drop-shadow-md rounded-full aspect-square w-14 flex flex-col items-center justify-center">
          <i className="fa-regular fa-plus fa-xl font-bold"></i>
          <p className="-mb-4 mt-1 text-sm">Video</p>
        </div>
      </div>
    </div>
  );
};

export default BottomBar;

// rotate-180 opacity-0
