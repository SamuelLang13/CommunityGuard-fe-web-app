🛡️ CommunityGuard

CommunityGuard je moderná webová aplikácia, ktorá umožňuje občanom nahlasovať problémy vo svojom okolí a organizovať komunitné podujatia. Využíva mapovú lokalizáciu a responzívny dizajn.

🚀 Funkcionalita

Nahlasovanie problémov s adresou a popisom

Vytváranie komunitných eventov (čistenie, oprava, iné)

Výber lokality kliknutím na mapu alebo zadaním manuálne

Automatické získanie adresy zo súradníc pomocou Nominatim (OpenStreetMap)

Responzívny dizajn (Tailwind CSS)

📦 Inštalácia (lokálne)

Vyžaduje: Node.js a npm

git clone https://gitlab.com/tvoj-projekt/communityguard.git
cd communityguard
npm install
npm run dev

Aplikácia bude dostupná na http://localhost:5173 (pri použití Vite).

🐳 Spustenie cez Docker

Vyžaduje: Docker

# Build image
docker build -t communityguard .

# Spusti kontajner
docker run -p 3000:80 communityguard

Aplikácia beží na http://localhost:3000

🛠️ Build pre produkciu

npm run build

Výstup sa uloží do priečinka dist/. Tento priečinok je možné nasadiť na ľubovoľný statický hosting (Netlify, GitHub Pages, Nginx...).

🗺️ API pre mapy

Aplikácia využíva:

Leaflet.js na zobrazenie mapy

Nominatim (OpenStreetMap) na reverzné geokódovanie súradníc

📂 Štruktúru projektu

communityguard/
├── public/
├── src/
│   ├── components/
│   ├── App.jsx
│   └── ...
├── Dockerfile
├── nginx.conf
├── package.json
├── README.md
└── ...

👥 Autori

Samuel Lang

Prispievatelia: Otvorené Pull Requesty sú vítané

📋 Licencia

MIT – Používaj, šír a upravuj podľa potreby 🌱