import React, { useRef } from "react";

const VideoPlayer = ({ videoURL, invalidVid = false, privateVid = false }) => {
  const foregroundVideoRef = useRef(null);
  const backgroundVideoRef = useRef(null);

  const syncVideos = () => {
    const foregroundVideo = foregroundVideoRef.current;
    const backgroundVideo = backgroundVideoRef.current;

    if (foregroundVideo && backgroundVideo) {
      if (foregroundVideo.paused) {
        backgroundVideo.pause();
      } else {
        backgroundVideo.play();
      }

      backgroundVideo.currentTime = foregroundVideo.currentTime;
    }
  };

  const handleSeek = () => {
    const foregroundVideo = foregroundVideoRef.current;
    const backgroundVideo = backgroundVideoRef.current;

    if (foregroundVideo && backgroundVideo) {
      backgroundVideo.currentTime = foregroundVideo.currentTime;
    }
  };

  return (
    <div className="bg-gray-400 w-full max-h-[60vh] h-52 md:h-60 lg:h-96 mx-auto text-white">
      {invalidVid || privateVid ? (
        <ErrorVideo type={invalidVid ? "invalid" : "private"} />
      ) : (
        <div className="relative h-full">
          <video
            ref={backgroundVideoRef}
            className="absolute w-screen object-fill blur-xl h-full z-0 mx-auto"
            muted
            playsInline
          >
            <source src={videoURL} />
          </video>
          <video
            ref={foregroundVideoRef}
            className="h-full relative z-10 mx-auto"
            controls
            autoPlay
            playsInline
            onPlay={syncVideos}
            onPause={syncVideos}
            onTimeUpdate={handleSeek}
            onSeeked={handleSeek}
          >
            <source src={videoURL} />
          </video>
        </div>
      )}
    </div>
  );
};

const ErrorVideo = ({ type }) => {
  return (
    <div className="h-full flex justify-center items-center flex-col">
      <i class="fa-solid fa-triangle-exclamation text-6xl my-2"></i>
      <p className="text-2xl">This video is {type}!</p>
    </div>
  );
};

export default VideoPlayer;
