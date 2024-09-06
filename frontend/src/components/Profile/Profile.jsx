import React from "react";
import { useParams } from "react-router-dom";

const Profile = () => {
  const { userId } = useParams();

  return (
    <div className="min-h-[calc(100vh-4rem)]">
      <Hero />
      {/* ***********   Selector   *********** */}
      <div>
        <div className="w-1/2 mx-auto p-3 bg-gray-100 rounded-lg">
          <ul className="text-sm font-medium text-center text-gray-500 rounded-lg shadow flex dark:divide-gray-700 dark:text-gray-400">
            <li className="w-full focus-within:z-10">
              <button className="inline-block w-full px-1 py-1.5 text-gray-900 bg-white border-r border-gray-200 rounded-s-lg focus:ring-4 focus:ring-blue-300 active focus:outline-none ">
                Videos
              </button>
            </li>

            <li className="w-full focus-within:z-10">
              <button className="inline-block w-full px-1 py-1.5 text-gray-900 bg-gray-200 border-s-0 border-gray-200  rounded-e-lg focus:ring-4 focus:outline-none focus:ring-blue-300 ">
                Posts
              </button>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Hero = ({
  avatar,
  coverImage,
  fullName,
  username,
  subscribers,
  isSubscribed,
}) => {
  return (
    <div className="pb-2 mb-4 shadow-md">
      <div className="bg-violet-400 aspect-[1546/423] sm:aspect-[1855/423] md:aspect-[2560/423] border-b-4 border-white">
        <img
          className="h-full w-full object-cover"
          src="https://yt3.googleusercontent.com/d8uUfoq_KYPKWLNtrGM-f9kDpionO_wdlQvO0oOIX9F4qEnxXtxSTTBTYkBgJeiPb0MCFGMQAw=w1138-fcrop64=1,00005a57ffffa5a8-k-c0xffffffff-no-nd-rj"
          alt=""
        />
      </div>
      <div className="h-14 relative">
        <img
          src="https://yt3.googleusercontent.com/3MC9XX7rtxeS55uoOQG2nvJ7zaBd17r8Uh0yk_R3KyKjAK_u4RlHhZcTCkx4yym0guGWdefD5Q=s160-c-k-c0x00ffffff-no-rj"
          alt="avatar"
          className="h-[180%] shadow-lg rounded-full border-4 border-white z-10 absolute bottom-2 left-1/2 -translate-x-1/2"
        />
      </div>
      <div className="relative z-10">
        <h1 className="text-center leading-6 font-josefin text-3xl md:text-4xl -mb-1 ">
          Beyond Fireship
        </h1>
        <h4 className="text-center text-gray-600 mt-1">@beyondFireship</h4>
        <div className="text-center text-gray-600 ">
          <span>5.9M Subscribers</span>
          &nbsp;&nbsp; &#8226; &nbsp;&nbsp;
          <span>2.1K Videos</span>
        </div>
        <button className="bg-red-600 drop-shadow-md text-white px-4 py-1 text-lg rounded-full block my-1 mx-auto">
          Subscribe
        </button>
      </div>
    </div>
  );
};

export default Profile;
