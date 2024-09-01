import "./App.css";
import BottomBar from "./components/BottomBar/BottomBar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Theater from "./components/Theater/Theater";
import Alert from "./components/Alert/Alert";
import { useState } from "react";

function App() {
  const [alert, setAlert] = useState({ content: "", type: "regular" });
  const showAlert = (content, type="regular") => {
    setAlert({
      content: content,
      type: type,
    });
    setTimeout(() => {
      setAlert({ content: "", type: "" });
    }, 3500);
  };

  return (
    <BrowserRouter>
      <Navbar showAlert={showAlert}/>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/watch/:videoId" element={<Theater />} />
      </Routes>
      <Alert alert={alert} />
      <BottomBar />
      <Footer />
    </BrowserRouter>
  );
}

export default App;
