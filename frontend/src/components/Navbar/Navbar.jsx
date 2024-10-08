import React, { useEffect, useState, useRef } from "react";
import default_user from "../../assets/default-user.png";
import { useUser } from "../../context/UserContext";

const Navbar = () => {
  const [isChecked, setIsChecked] = useState(null);
  const navRef = useRef(null);
  const searchRef = useRef(null);
  const iconRef = useRef(null);

  useEffect(() => {
    if (isChecked !== null) {
      navRef.current.classList.toggle("drop-shadow");
      searchRef.current.classList.toggle("hidden");
      iconRef.current.classList.toggle("fa-magnifying-glass");
      iconRef.current.classList.toggle("fa-xmark");
    }
  }, [isChecked]);

  // const {user} = useUser();
  // console.log(user)
  return (
    <div>
      <nav ref={navRef} className="bg-red-500 h-16 drop-shadow">
        <div className="flex items-center justify-between h-full">
          <div className="font-oswald text-3xl flex items-center text-white pl-3 font-semibold">
            SWEETUBE
          </div>
          <div className="flex items-center pr-3">
            <label htmlFor="search" className="cursor-pointer">
              <i
                ref={iconRef}
                className="fa-solid fa-magnifying-glass fa-xl px-2"
                style={{ color: "#ffffff" }}
              ></i>
              <input
                className="hidden"
                type="checkbox"
                name="search"
                id="search"
                onClick={(e) => setIsChecked(e.target.checked)}
              />
            </label>
            <a href="#">
              <img
                src={default_user}
                alt="profile"
                className="h-9 w-9 ml-2 rounded-full shadow-md cursor-pointer"
              />
            </a>
          </div>
        </div>
      </nav>
      <div>
        <div ref={searchRef} className="my-1 ml-1 hidden">
          <form className="flex">
            <input
              type="text"
              id="first_name"
              className="bg-red-500 w-[75%] rounded-lg text-white focus:outline-none px-3 py-2 placeholder:text-white"
              placeholder="Search for videos"
              required
            />
            <button
              className="w-[23%] bg-red-500 block mx-auto rounded-lg text-white"
              type="submit"
            >
              Search
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
