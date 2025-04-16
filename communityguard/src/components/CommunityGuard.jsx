import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

const markerIcon = new L.Icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });
  return null;
}

export default function CommunityGuard() {
  const [view, setView] = useState("landing");
  const [issueSubject, setIssueSubject] = useState("");
  const [issueDetails, setIssueDetails] = useState("");
  const [issueAddress, setIssueAddress] = useState("");
  const [issuePhoto, setIssuePhoto] = useState(null);
  const [eventType, setEventType] = useState("upratovanie");
  const [eventDetails, setEventDetails] = useState("");
  const [eventStart, setEventStart] = useState("");
  const [eventEnd, setEventEnd] = useState("");
  const [eventAddress, setEventAddress] = useState("");
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapTarget, setMapTarget] = useState(null);
  const mapRef = useRef();

  const handleMapSelect = (latlng) => {
    const formatted = `Lat: ${latlng.lat.toFixed(5)}, Lng: ${latlng.lng.toFixed(5)}`;
    if (mapTarget === "issue") setIssueAddress(formatted);
    if (mapTarget === "event") setEventAddress(formatted);
    setMapModalOpen(false);
  };

  const validIssue = issueSubject && issueDetails && issueAddress;
  const validEvent = eventDetails && eventStart && eventEnd && eventAddress;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-12">
      <motion.h1 className="text-4xl font-bold text-center" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>CommunityGuard</motion.h1>
      <div className="flex justify-center gap-4">
        <button className="px-4 py-2 bg-blue-600 text-white rounded" onClick={() => setView("report")}>Nahlásiť problém</button>
        <button className="px-4 py-2 bg-green-600 text-white rounded" onClick={() => setView("event")}>Vytvoriť komunitnú akciu</button>
      </div>

      {view === "report" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Nahlásiť problém</h2>
          <input type="text" placeholder="Predmet problému" value={issueSubject} onChange={(e) => setIssueSubject(e.target.value)} className="w-full border p-2 rounded" />
          <textarea placeholder="Detaily problému" value={issueDetails} onChange={(e) => setIssueDetails(e.target.value)} className="w-full border p-2 rounded"></textarea>
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Adresa" value={issueAddress} readOnly className="w-full border p-2 rounded" />
            <button onClick={() => { setMapModalOpen(true); setMapTarget("issue"); }} className="bg-gray-200 px-2 py-1 rounded">📍</button>
          </div>
          <input type="file" onChange={(e) => setIssuePhoto(e.target.files[0])} />
          <button disabled={!validIssue} onClick={() => alert("Problém bol nahlásený ✅")}
            className={`px-4 py-2 rounded text-white ${validIssue ? "bg-blue-600" : "bg-gray-400 cursor-not-allowed"}`}>
            Odoslať hlásenie
          </button>
        </div>
      )}

      {view === "event" && (
        <div className="space-y-4">
          <h2 className="text-2xl font-semibold">Komunitná akcia</h2>
          <select value={eventType} onChange={(e) => setEventType(e.target.value)} className="border p-2 rounded">
            <option value="upratovanie">Upratovanie</option>
            <option value="oprava">Oprava</option>
            <option value="ine">Iné</option>
          </select>
          <textarea placeholder="Popis akcie" value={eventDetails} onChange={(e) => setEventDetails(e.target.value)} className="w-full border p-2 rounded"></textarea>
          <input type="datetime-local" value={eventStart} onChange={(e) => setEventStart(e.target.value)} className="border p-2 rounded w-full" />
          <input type="datetime-local" value={eventEnd} onChange={(e) => setEventEnd(e.target.value)} className="border p-2 rounded w-full" />
          <div className="flex items-center gap-2">
            <input type="text" placeholder="Adresa" value={eventAddress} readOnly className="w-full border p-2 rounded" />
            <button onClick={() => { setMapModalOpen(true); setMapTarget("event"); }} className="bg-gray-200 px-2 py-1 rounded">📍</button>
          </div>
          <button disabled={!validEvent} onClick={() => alert("Akcia bola vytvorená ✅")}
            className={`px-4 py-2 rounded text-white ${validEvent ? "bg-green-600" : "bg-gray-400 cursor-not-allowed"}`}>
            Vytvoriť akciu
          </button>
        </div>
      )}

      {mapModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-4 rounded shadow-md w-full max-w-2xl relative">
            <h3 className="text-xl font-bold mb-2">Vyberte miesto</h3>
            <MapContainer center={[48.1486, 17.1077]} zoom={13} style={{ height: "300px" }} ref={mapRef}>
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <LocationPicker onSelect={handleMapSelect} />
              {(mapTarget === "issue" && issueAddress) && <Marker position={issueAddress} icon={markerIcon} />}
              {(mapTarget === "event" && eventAddress) && <Marker position={eventAddress} icon={markerIcon} />}
            </MapContainer>
            <button onClick={() => setMapModalOpen(false)} className="absolute top-2 right-2">✖</button>
          </div>
        </div>
      )}
    </div>
  );
}