import Navbar from "../components/Navbar";
import Hero from "../sections/Hero";
import Rooms from "../sections/Rooms";
import Location from "../sections/Location";
import Footer from "../components/Footer"; // adjust if needed

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Rooms />
      <Location />
      <Footer />
    </>
  );
}