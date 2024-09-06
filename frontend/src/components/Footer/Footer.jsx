import React from "react";

const Footer = () => {
  return (
    <footer className="bg-red-500 relative z-50 shadow">
      <div className="w-full max-w-screen-xl mx-auto p-4 md:py-8">
        <div className="sm:flex sm:items-center sm:justify-between">
          <div className="text-4xl mt-2 font-semibold whitespace-nowrap text-center text-white font-oswald sm:m-0">
            SWEETUBE
          </div>
          <ul className="flex flex-wrap items-center justify-center my-5 text-sm font-medium sm:m-0 text-white">
            <li>
              <a href="#" className="hover:underline me-4 md:me-6">
                About
              </a>
            </li>
            <li>
              <a
                href="https://github.com/24kaushik/sweet-tube"
                className="hover:underline me-4 md:me-6"
              >
                Github
              </a>
            </li>
            <li>
              <a
                href="https://raw.githubusercontent.com/24kaushik/sweet-tube/main/LICENSE"
                className="hover:underline me-4 md:me-6"
              >
                Licensing
              </a>
            </li>
            <li>
              <a
                href="mailto:kaushik.s.contact@gmail.com"
                className="hover:underline"
              >
                Contact
              </a>
            </li>
          </ul>
        </div>
        <hr className="my-6 border-white border-b-2 sm:mx-auto lg:my-8" />
        <span className="block text-sm text-white text-center ">
          © {`${new Date().getFullYear()} `}
          <a href="https://24kaushik.vercel.app/" className="hover:underline">
            Kaushik Sarkar
          </a>
          . All Rights Reserved.
        </span>
      </div>
    </footer>
  );
};

export default Footer;
