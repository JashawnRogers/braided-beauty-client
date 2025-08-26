import "./index.css";
import Navbar from "./components/pages/landingPage/Navbar";
import Hero from "./components/pages/landingPage/Hero";
import CallToAction from "./components/call-to-action";
import About from "./components/content-1";
import Footer from "./components/footer";
import Banner from "./components/pages/landingPage/Banner";

function App() {
  return (
    <>
      <Navbar />
      <Hero />
      <Banner />
      <CallToAction />
      <About />
      <Footer />
    </>
  );
}

export default App;
