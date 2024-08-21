import "./App.css";
import BottomBar from "./components/BottomBar/BottomBar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

function App() {
  const router = createBrowserRouter([
    {
      path: "/",
      element: <Home />,
    },
  ]);
  return (
    <>
      <Navbar />
      <RouterProvider router={router} />
      <BottomBar />
      <Footer />
    </>
  );
}

export default App;
