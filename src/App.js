import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Routers from "./routers/Routers";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const App = () => {
  return (
    <>
      <ToastContainer limit={1} />
      <Navbar />
      <div style={{ minHeight: 100 + "vh" }}>
        <Routers />
      </div>
      <Footer />
    </>
  );
};

export default App;
