import AccorPhotoStrip from "../sections/AccorPhotoStrip";
import HeroBookingSearch from "../sections/HeroBookingSearch";
import Rooms from "../sections/Rooms";
import Location from "../sections/Location";

export default function Home() {
  return (
    <>
      <AccorPhotoStrip onOpenGallery={() => (window.location.href = "/gallery")} />
      <HeroBookingSearch />
      <Rooms />
      <div id="map">
        <Location />
      </div>
    </>
  );
}