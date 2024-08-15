import "./App.css";
import BottomBar from "./components/BottomBar/BottomBar";
import Footer from "./components/Footer/Footer";
import Home from "./components/Home/Home";
import Navbar from "./components/Navbar/Navbar";

function App() {
  return (
    <>
      <Navbar />
      <Home />
      <BottomBar />
      <Footer />
    </>
  );
}

export default App;
