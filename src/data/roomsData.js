// src/data/roomsData.js

/* STANDARD DOUBLE */
import standardDbl1 from "../assets/rooms/standard-dbl/standard-dbl.jpg";
import standardDbl2 from "../assets/rooms/standard-dbl/standard-dbl-2.jpg";
import standardDbl3 from "../assets/rooms/standard-dbl/standard-dbl-3.jpg";
import standardDblToilet from "../assets/rooms/standard-dbl/standard-dbl-toilet.jpg";

/* STANDARD SINGLE */
import standardSgl2 from "../assets/rooms/standard-sgl/standard-sgl-2.jpg";
import standardSgl3 from "../assets/rooms/standard-sgl/standard-sgl-3.jpg";
import standardSglToilet1 from "../assets/rooms/standard-sgl/standard-sgl-toilet-1.jpg";
import standardSglToilet from "../assets/rooms/standard-sgl/standard-sgl-toilet.jpg";

/* SUITE DOUBLE */
import suiteDbl1 from "../assets/rooms/suite-dbl/suite-dbl-1.jpg";
import suiteDbl2 from "../assets/rooms/suite-dbl/suite-dbl-2.jpg";
import suiteDblToilet from "../assets/rooms/suite-dbl/suite-dbl-toilet.jpg";

/* SUITE SINGLE */
import suiteSgl1 from "../assets/rooms/suite-sgl/suite-sgl-1.jpg";
import suiteSgl3 from "../assets/rooms/suite-sgl/suite-sgl-3.jpg";
import suiteSglLeg from "../assets/rooms/suite-sgl/suite-sgl-lge.jpg";
import suiteSglToilet from "../assets/rooms/suite-sgl/suite-sgl-toilet.jpg";

const rooms = [
  {
    id: "suite-sgl",
    name: "Suite (Single)",
    price: 7000,
    currency: "BTN",
    image: suiteSgl1,
    images: [suiteSgl1, suiteSgl3, suiteSglLeg, suiteSglToilet],
    maxAdults: 1,
    desc: "Luxury Bhutanese suite for single occupancy.",
    bed: "1 King bed",
    size: "35m²",

    // ✅ ADDED: pricing rates used by Pricing.jsx
    rates: [
      {
        id: "flex",
        label: "Flexible Rate",
        pricePerNight: 7000,
        note: "Pay at the property. Free cancellation up to 2 days before arrival.",
        perks: ["Breakfast included", "Free Wi-Fi"],
      },
      {
        id: "save",
        label: "Saver Rate",
        pricePerNight: 6500,
        note: "Non-refundable. Best price.",
        perks: ["Breakfast included", "Free Wi-Fi"],
      },
    ],
  },

  {
    id: "suite-dbl",
    name: "Suite (Double)",
    price: 8000,
    currency: "BTN",
    image: suiteDbl1,
    images: [suiteDbl1, suiteDbl2, suiteDblToilet],
    maxAdults: 2,
    desc: "Spacious heritage suite for two guests.",
    bed: "1 King bed",
    size: "40m²",

    // ✅ ADDED
    rates: [
      {
        id: "flex",
        label: "Flexible Rate",
        pricePerNight: 8000,
        note: "Pay at the property. Free cancellation up to 2 days before arrival.",
        perks: ["Breakfast included", "Free Wi-Fi"],
      },
      {
        id: "save",
        label: "Saver Rate",
        pricePerNight: 7500,
        note: "Non-refundable. Best price.",
        perks: ["Breakfast included", "Free Wi-Fi"],
      },
    ],
  },

  {
    id: "standard-sgl",
    name: "Standard (Single)",
    price: 5000,
    currency: "BTN",
    image: standardSgl2,
    images: [standardSgl2, standardSgl3, standardSglToilet1, standardSglToilet],
    maxAdults: 1,
    desc: "Comfortable standard room for solo travellers.",
    bed: "1 Queen bed",
    size: "22m²",

    // ✅ ADDED
    rates: [
      {
        id: "flex",
        label: "Flexible Rate",
        pricePerNight: 5000,
        note: "Pay at the property. Free cancellation up to 2 days before arrival.",
        perks: ["Free Wi-Fi"],
      },
      {
        id: "save",
        label: "Saver Rate",
        pricePerNight: 4700,
        note: "Non-refundable. Best price.",
        perks: ["Free Wi-Fi"],
      },
    ],
  },

  {
    id: "standard-dbl",
    name: "Standard (Double)",
    price: 6000,
    currency: "BTN",
    image: standardDbl1,
    images: [standardDbl1, standardDbl2, standardDbl3, standardDblToilet],
    maxAdults: 2,
    desc: "Traditional standard room ideal for two guests.",
    bed: "1 Queen bed",
    size: "26m²",

    // ✅ ADDED
    rates: [
      {
        id: "flex",
        label: "Flexible Rate",
        pricePerNight: 6000,
        note: "Pay at the property. Free cancellation up to 2 days before arrival.",
        perks: ["Free Wi-Fi"],
      },
      {
        id: "save",
        label: "Saver Rate",
        pricePerNight: 5600,
        note: "Non-refundable. Best price.",
        perks: ["Free Wi-Fi"],
      },
    ],
  },
];

export default rooms;