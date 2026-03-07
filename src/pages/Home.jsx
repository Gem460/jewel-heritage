import Hero from "../sections/Hero";
import Rooms from "../sections/Rooms";
import Location from "../sections/Location";

export default function Home() {
  return (
    <>
      <Hero />
      <Rooms />
      <div id="map">
        <Location />
      </div>
    </>
  );
}