import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./footer";
export default function Layout() {
  return (
    <>
      <Navbar />
      <main className="lg:pt-8 xl:pt-10">
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
