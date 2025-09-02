import { Outlet } from "react-router";
import Navbar from "./Navbar";
import Footer from "./footer";
export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
}
