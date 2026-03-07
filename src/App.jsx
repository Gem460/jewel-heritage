import { Routes, Route, Navigate } from "react-router-dom";
import Layout from "./components/Layout";

import Home from "./pages/Home";
import Gallery from "./pages/Gallery";
import Pricing from "./pages/Pricing";
import PricingConfirm from "./pages/PricingConfirm";
import Checkout from "./pages/Checkout";
import Bookings from "./pages/Bookings";
import About from "./pages/About";
import Cancellation from "./pages/Cancellation";
import Contact from "./sections/Contact";

function NotFound() {
  return (
    <div className="p-10">
      <h1 className="text-2xl font-semibold">Page not found</h1>
      <a className="underline" href="/">Go Home</a>
    </div>
  );
}

export default function App() {
  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/pricing-confirm" element={<PricingConfirm />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/bookings" element={<Bookings />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/cancel-booking" element={<Cancellation />} />
        <Route path="/home" element={<Navigate to="/" replace />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Layout>
  );
}