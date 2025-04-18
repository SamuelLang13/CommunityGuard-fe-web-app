import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";

// Funkcia na získanie adresy zo súradníc cez Nominatim
const getAddressFromCoordinates = async (lat, lng) => {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json&addressdetails=1`;
  const response = await fetch(url);
  const data = await response.json();
  return data.display_name || "Neznáma adresa";
};

// Komponent na zobrazenie mapy a výber bodu
function MapSelector({ setAddress }) {
  const [position, setPosition] = useState([48.1482, 17.1067]); // Prednastavené súradnice (Bratislava)

  const MapClickHandler = () => {
    useMapEvents({
      click(e) {
        const lat = e.latlng.lat;
        const lng = e.latlng.lng;
        setPosition([lat, lng]);
        getAddressFromCoordinates(lat, lng).then((address) => {
          setAddress(address); // Nastavenie adresy do formulára
        });
      },
    });
  };

  return (
    <div style={{ height: "300px", marginBottom: "1rem" }}>
      <MapContainer center={position} zoom={13} style={{ height: "100%" }}>
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        <MapClickHandler />
        <Marker position={position}>
          <Popup>Vybraný bod: {position[0].toFixed(4)}, {position[1].toFixed(4)}</Popup>
        </Marker>
      </MapContainer>
    </div>
  );
}

export default function CommunityGuard() {
  const [address, setAddress] = useState("");
  const [formType, setFormType] = useState("");
  const [manualAddress, setManualAddress] = useState("");
  const [useMap, setUseMap] = useState(false);

  const reportRef = useRef(null);
  const eventRef = useRef(null);

  const resetLocationInputs = () => {
    setAddress("");
    setManualAddress("");
    setUseMap(false);
  };

  const scrollToSection = (ref) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    alert(`Formulár bol odoslaný! Adresa: ${useMap ? address : manualAddress}`);
  };

  return (
    <>
      <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-gray-100">
        <h1 className="text-4xl md:text-5xl font-bold text-blue-700 mb-6">CommunityGuard</h1>
        <p className="text-lg md:text-xl text-gray-700 mb-10 max-w-2xl">
          Zapoj sa do ochrany svojho okolia. Nahlasuj problémy alebo organizuj komunitné podujatia.
        </p>

        <div className="flex flex-col md:flex-row gap-6">
          <button
            onClick={() => {
              resetLocationInputs();
              setFormType("report");
              scrollToSection(reportRef);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Nahlásiť problém
          </button>
          <button
            onClick={() => {
              resetLocationInputs();
              setFormType("event");
              scrollToSection(eventRef);
            }}
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg shadow-lg transition"
          >
            Vytvoriť komunitné podujatie
          </button>
        </div>
      </div>

      {/* Sekcia na nahlásenie problému */}
      <section ref={reportRef} className="px-6 py-16 bg-white rounded-xl shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-blue-700 mb-6">Nahlásiť problém</h2>
        {formType === "report" && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                Predmet
              </label>
              <input
                type="text"
                id="subject"
                required
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Zadajte predmet problému"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-2">
                Popis
              </label>
              <textarea
                id="details"
                required
                rows="4"
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                placeholder="Popíšte problém"
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-2">
                Lokalita
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  id="address"
                  value={useMap ? address : manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                  placeholder="Zadajte adresu alebo kliknite na mapu"
                />
                <button
                  type="button"
                  onClick={() => setUseMap(!useMap)}
                  className="ml-2 text-blue-600 hover:text-blue-800"
                >
                  {useMap ? "Zadať adresu manuálne" : "Vybrať adresu z mapy"}
                </button>
              </div>
              {useMap && <MapSelector setAddress={setAddress} />}
            </div>
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-lg transition w-full"
            >
              Nahlásiť problém
            </button>
          </form>
        )}
      </section>

      {/* Sekcia na vytvorenie podujatia */}
      <section ref={eventRef} className="px-6 py-16 bg-gray-50 rounded-xl shadow-lg mt-12">
        <h2 className="text-3xl font-bold text-green-700 mb-6">Vytvoriť komunitné podujatie</h2>
        {formType === "event" && (
          <form onSubmit={handleFormSubmit} className="space-y-6">
            <div className="space-y-2">
              <label htmlFor="eventType" className="block text-sm font-medium text-gray-700 mb-2">
                Typ podujatia
              </label>
              <select
                id="eventType"
                required
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
              >
                <option value="cleanup">Čistenie</option>
                <option value="repair">Oprava</option>
                <option value="other">Iné</option>
              </select>
            </div>
            <div className="space-y-2">
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                Popis
              </label>
              <textarea
                id="description"
                required
                rows="4"
                className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                placeholder="Popíšte podujatie"
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="startDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Začiatok podujatia
                </label>
                <input
                  type="datetime-local"
                  id="startDateTime"
                  required
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                />
              </div>
              <div className="space-y-2">
                <label htmlFor="endDateTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Koniec podujatia (voliteľné)
                </label>
                <input
                  type="datetime-local"
                  id="endDateTime"
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-transparent"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label htmlFor="eventAddress" className="block text-sm font-medium text-gray-700 mb-2">
                Lokalita
              </label>
              <div className="flex items-center mb-4">
                <input
                  type="text"
                  id="eventAddress"
                  value={useMap ? address : manualAddress}
                  onChange={(e) => setManualAddress(e.target.value)}
                  className="w-full p-4 rounded-xl border border-gray-300 focus:outline-none focus:ring-2 focus:ring-green-600 focus:border-transparent"
                  placeholder="Zadajte adresu alebo kliknite na mapu"
                />
                <button
                  type="button"
                  onClick={() => setUseMap(!useMap)}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  {useMap ? "Zadať adresu manuálne" : "Vybrať adresu z mapy"}
                </button>
              </div>
              {useMap && <MapSelector setAddress={setAddress} />}
            </div>
            <button
              type="submit"
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition w-full"
            >
              Vytvoriť podujatie
            </button>
          </form>
        )}
      </section>

      {/* Pätka */}
      <footer className="bg-blue-800 text-white w-full py-8 mt-12">
        <div className="content">
          <div className="min-w-[200px] mb-4">
            <h3 className="font-semibold text-lg">Kontakt</h3>
            <p>Email: communityguard@example.com</p>
            <p>Tel: +421 123 456 789</p>
            <h3 className="font-semibold text-lg">Náležitosti</h3>
            <p>&copy; 2025 CommunityGuard</p>
            <p>Všetky práva vyhradené</p>
          </div>
        </div>
      </footer>
    </>
  );
}