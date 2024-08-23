import "./App.css";
import BottomBar from "./components/BottomBar/BottomBar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Theater from "./components/Theater/Theater";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:videoId" element={<Theater />} />
      </Routes>
      <BottomBar />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
