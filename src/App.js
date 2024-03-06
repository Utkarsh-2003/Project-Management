import "./App.css";
import Footer from "./Components/Footer";
import Navbar from "./Components/Navbar";
import Routers from "./routers/Routers";

const App = () => {
  return (
    <>
    <Navbar />
    <div style={{minHeight:100+'vh'}}>
      <Routers />
    </div>
    <Footer />
    </>
  );
}

export default App;
