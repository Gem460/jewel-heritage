// src/data/roomsData.js
// Your REAL structure (from screenshot):
// Covers:  src/assets/rooms/<id>.jpg
// Gallery: src/assets/hotel/rooms/<id>/*.jpg

import suiteSglCover from "../assets/rooms/suite-sgl.jpg";
import suiteDblCover from "../assets/rooms/suite-dbl.jpg";
import standardSglCover from "../assets/rooms/standard-sgl.jpg";
import standardDblCover from "../assets/rooms/standard-dbl.jpg";

// Load ALL images inside gallery folders:
// src/assets/hotel/rooms/<id>/*.jpg
const galleryImages = import.meta.glob("../assets/hotel/rooms/*/*.jpg", {
  eager: true,
  import: "default",
});

const coverById = {
  "suite-sgl": suiteSglCover,
  "suite-dbl": suiteDblCover,
  "standard-sgl": standardSglCover,
  "standard-dbl": standardDblCover,
};

const getGallery = (id) => {
  const prefix = `../assets/hotel/rooms/${id}/`;

  const items = Object.entries(galleryImages)
    .filter(([path]) => path.startsWith(prefix))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, src]) => src);

  const cover = coverById[id] || null;

  // If no gallery images, fallback to cover only
  if (items.length === 0 && cover) return [cover];

  // Ensure cover is first
  if (cover && items[0] !== cover) return [cover, ...items];

  return items;
};

export const rooms = [
  {
    id: "suite-sgl",
    name: "Suite (Single)",
    price: 7000,
    currency: "BTN",
    image: coverById["suite-sgl"],
    gallery: getGallery("suite-sgl"),
    maxAdults: 1,
    desc: "Luxury Bhutanese suite for single occupancy.",
  },
  {
    id: "suite-dbl",
    name: "Suite (Double)",
    price: 8000,
    currency: "BTN",
    image: coverById["suite-dbl"],
    gallery: getGallery("suite-dbl"),
    maxAdults: 2,
    desc: "Spacious heritage suite for two guests.",
  },
  {
    id: "standard-sgl",
    name: "Standard (Single)",
    price: 5000,
    currency: "BTN",
    image: coverById["standard-sgl"],
    gallery: getGallery("standard-sgl"),
    maxAdults: 1,
    desc: "Comfortable standard room for solo travellers.",
  },
  {
    id: "standard-dbl",
    name: "Standard (Double)",
    price: 6000,
    currency: "BTN",
    image: coverById["standard-dbl"],
    gallery: getGallery("standard-dbl"),
    maxAdults: 2,
    desc: "Traditional standard room ideal for two guests.",
  },
];