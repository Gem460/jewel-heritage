import { useLocation, useNavigate } from "react-router-dom";

const tabs = [
  { label: "Prices", to: "/pricing" },
  { label: "Photos", to: "/gallery" },
  { label: "Map", to: "/#map" },
  { label: "Hotel Information", to: "/about" },
];

export default function HotelTabsHeader() {
  const navigate = useNavigate();
  const location = useLocation();

  function go(tab) {
    if (tab.to.startsWith("/#")) {
      const id = tab.to.replace("/#", "");

      if (location.pathname === "/") {
        document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
      } else {
        navigate("/");
        setTimeout(() => {
          document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
        }, 200);
      }

      return;
    }

    navigate(tab.to);
  }

  return (
    <header className="sticky top-0 z-40 jh-gold-header text-white">

      {/* Sparkle effect layer */}
      <div className="jh-sparkles" />

      <div className="relative">

        {/* Logo + Title */}
        <div className="mx-auto max-w-6xl px-4 pt-6 pb-4">
          <div className="flex items-center gap-3">

            <img
              src="/logo.png"
              alt="The Jewel Heritage"
              className="h-12 w-12 object-contain"
            />

            <div>
              <h1 className="text-2xl md:text-3xl font-semibold">
                The Jewel Heritage
              </h1>

              <p className="text-white/90 text-sm">
                Paro, Changsima
              </p>
            </div>

          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="border-t border-white/20">
          <div className="mx-auto max-w-6xl px-4">

            <div className="flex gap-6 py-3 overflow-x-auto whitespace-nowrap">

              {tabs.map((t) => (
                <button
                  key={t.label}
                  onClick={() => go(t)}
                  className="text-sm md:text-base text-white hover:text-yellow-200"
                >
                  {t.label}
                </button>
              ))}

            </div>

          </div>
        </nav>

      </div>

    </header>
  );
}