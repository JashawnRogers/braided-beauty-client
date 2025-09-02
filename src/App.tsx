import "./index.css";
import Navbar from "./components/shared/Navbar";
import Hero from "../src/components/landingPage//Hero";
import CallToAction from "./components/ui/call-to-action";
import About from "./components/ui/content-1";
import Footer from "./components/shared/footer";
import Banner from "../src/components/landingPage//Banner";

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
