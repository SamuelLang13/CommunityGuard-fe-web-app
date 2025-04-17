// src/components/CommunityGuard.jsx
import { useState, useRef } from "react";
import { Card, CardContent } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Textarea } from "@/components/ui/Textarea";
import { Camera, Send, Users, Search, ArrowLeft, Menu } from "lucide-react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41]
});

function LocationPicker({ setCoords }) {
  useMapEvents({
    click(e) {
      setCoords(e.latlng);
    }
  });
  return null;
}

function MapModal({ onClose, onSelect }) {
  const [modalCoords, setModalCoords] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [map, setMap] = useState(null);
  const [searchResults, setSearchResults] = useState([]);

  const handleSearch = async () => {
    if (!searchTerm.trim()) return;
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchTerm)}`
    );
    const results = await response.json();
    setSearchResults(results);
    if (results.length > 0) {
      const first = results[0];
      const latlng = { lat: parseFloat(first.lat), lng: parseFloat(first.lon) };
      setModalCoords(latlng);
      if (map) map.setView(latlng, 16);
    }
  };

  const handleResultClick = (result) => {
    const latlng = { lat: parseFloat(result.lat), lng: parseFloat(result.lon) };
    setModalCoords(latlng);
    if (map) map.setView(latlng, 16);
    setSearchResults([]);
    setSearchTerm(result.display_name);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-lg w-[90%] max-w-2xl p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-600">✕</button>
        <h2 className="text-lg font-semibold mb-2">Vyberte miesto na mape</h2>
        <div className="flex gap-2 mb-2">
          <Input
            placeholder="Zadajte adresu"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <Button onClick={handleSearch}><Search className="w-4 h-4" /></Button>
        </div>
        {searchResults.length > 0 && (
          <ul className="max-h-40 overflow-y-auto mb-2 border rounded p-2 text-sm bg-gray-50">
            {searchResults.map((result, index) => (
              <li
                key={index}
                className="cursor-pointer hover:bg-gray-200 p-1"
                onClick={() => handleResultClick(result)}
              >
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
        <MapContainer
          center={[48.15, 17.11]}
          zoom={13}
          className="h-80 rounded"
          whenCreated={setMap}
        >
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationPicker setCoords={setModalCoords} />
          {modalCoords && <Marker position={modalCoords} icon={markerIcon} />}
        </MapContainer>
        <div className="flex justify-end mt-4">
          <Button
            onClick={() => {
              if (modalCoords) onSelect(modalCoords);
              onClose();
            }}
          >
            Vybrať miesto
          </Button>
        </div>
      </div>
    </div>
  );
}

export default function CommunityGuard() {
  const [section, setSection] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);
  const [issue, setIssue] = useState("");
  const [details, setDetails] = useState("");
  const [location, setLocation] = useState("");
  const [photo, setPhoto] = useState(null);
  const [eventType, setEventType] = useState("");
  const [eventDesc, setEventDesc] = useState("");
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");
  const [coords, setCoords] = useState(null);
  const [showMapModal, setShowMapModal] = useState(false);

  const handleReport = () => {
    if (!issue || !details || !location) {
      alert("Vyplňte všetky povinné polia.");
      return;
    }
    console.log({ issue, details, location, photo, coords });
    alert("Ďakujeme za nahlásenie problému! 💪");
    setIssue(""); setDetails(""); setLocation(""); setPhoto(null); setCoords(null);
  };

  const handleEventCreate = () => {
    if (!eventType || !eventDesc || !start || !end || !location) {
      alert("Vyplňte všetky povinné polia pre komunitnú akciu.");
      return;
    }
    console.log({ eventType, eventDesc, start, end, location, coords });
    alert("Komunitná akcia vytvorená! 🙌");
    setEventType(""); setEventDesc(""); setStart(""); setEnd(""); setLocation(""); setCoords(null);
  };

  const openMapModal = () => setShowMapModal(true);
  const closeMapModal = () => setShowMapModal(false);
  const handleMapSelect = (latlng) => {
    setCoords(latlng);
    setLocation(`${latlng.lat.toFixed(5)}, ${latlng.lng.toFixed(5)}`);
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      {showMapModal && <MapModal onClose={closeMapModal} onSelect={handleMapSelect} />}
      <motion.div className="flex items-center justify-between mb-4">
        <motion.h1 className="text-3xl font-bold">CommunityGuard</motion.h1>
        <Button variant="ghost" onClick={() => setMenuOpen(!menuOpen)}><Menu /></Button>
      </motion.div>
      {menuOpen && (
        <div className="flex gap-4 justify-center mb-6">
          <Button onClick={() => { setSection("problem"); setMenuOpen(false); document.getElementById("problem-section")?.scrollIntoView({ behavior: 'smooth' }); }}>Nahlásiť problém</Button>
          <Button onClick={() => { setSection("event"); setMenuOpen(false); document.getElementById("event-section")?.scrollIntoView({ behavior: 'smooth' }); }}>Vytvoriť komunitnú akciu</Button>
        </div>
      )}
      <motion.p className="text-center text-gray-600 mb-6">
        Spojte sa, nahláste problémy a pomôžte svojej komunite 💡
      </motion.p>

      {section === null && !menuOpen && (
        <div className="flex gap-4 justify-center mb-8">
          <Button onClick={() => { setSection("problem"); document.getElementById("problem-section")?.scrollIntoView({ behavior: 'smooth' }); }}>Nahlásiť problém</Button>
          <Button onClick={() => { setSection("event"); document.getElementById("event-section")?.scrollIntoView({ behavior: 'smooth' }); }}>Vytvoriť komunitnú akciu</Button>
        </div>
      )}

      <div className="space-y-6">
        {section === "problem" && (
          <Card id="problem-section">
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">Nahlásiť problém</h2>
              <Input placeholder="Názov problému" value={issue} onChange={(e) => setIssue(e.target.value)} />
              <Textarea placeholder="Podrobnosti" value={details} onChange={(e) => setDetails(e.target.value)} />
              <div className="flex gap-2">
                <Input placeholder="Adresa alebo súradnice" value={location} readOnly />
                <Button onClick={openMapModal}>Vybrať na mape</Button>
              </div>
              <Input type="file" onChange={(e) => setPhoto(e.target.files?.[0] || null)} />
              <Button onClick={handleReport}><Send className="w-4 h-4 mr-2" />Odoslať</Button>
            </CardContent>
          </Card>
        )}

        {section === "event" && (
          <Card id="event-section">
            <CardContent className="space-y-4 pt-6">
              <h2 className="text-xl font-semibold">Vytvoriť komunitnú akciu</h2>
              <Input placeholder="Typ akcie (upratovanie, oprava...)" value={eventType} onChange={(e) => setEventType(e.target.value)} />
              <Textarea placeholder="Popis akcie" value={eventDesc} onChange={(e) => setEventDesc(e.target.value)} />
              <div className="flex gap-2">
                <Input placeholder="Adresa alebo súradnice" value={location} readOnly />
                <Button onClick={openMapModal}>Vybrať na mape</Button>
              </div>
              <div className="flex gap-2">
                <Input type="datetime-local" value={start} onChange={(e) => setStart(e.target.value)} />
                <Input type="datetime-local" value={end} onChange={(e) => setEnd(e.target.value)} />
              </div>
              <Button onClick={handleEventCreate}><Users className="w-4 h-4 mr-2" />Vytvoriť</Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
