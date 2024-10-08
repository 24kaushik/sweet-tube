import React, { useEffect, useRef } from "react";

const Alert = ({ alert }) => {
  const { content, type = "regular" } = alert;
  return (
    <div
      id="alert-border-1"
      className={`fixed bottom-0 z-20 w-11/12 border-2 mx-auto left-0 right-0 flex items-center p-4 mb-4 text-blue-800 border-t-4 border-blue-300 bg-blue-50 dark:text-blue-400 dark:bg-gray-800 dark:border-blue-800 overflow-hidden ${content ? "" : "hidden"}`}
      role="alert"
    >
      {content && <div className="alert-timer"></div>}
      <svg
        className="flex-shrink-0 w-4 h-4"
        aria-hidden="true"
        xmlns="http://www.w3.org/2000/svg"
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
      </svg>
      <div className="ms-3 text-md">{content}</div>
    </div>
  );
};

export default Alert;
