import Navbar from "./Navbar";
import Footer from "../sections/Footer";

export default function Layout({ children }) {
  return (
    <>
      <Navbar />
      {children}
      <Footer />
    </>
  );
}