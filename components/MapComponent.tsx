'use client';

import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { MapPin, Navigation } from 'lucide-react';
import Link from 'next/link';

// Fix for default marker icons in Next.js
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

const LOCATIONS = [
  {
    id: 'unidade1',
    name: 'Unidade 1 - Teatro do Mundo',
    address: 'R. Barão de Melgaço, 177 - Centro, Campo Grande - MS',
    position: [-20.464686, -54.61439] as [number, number], // Approx coordinates for Centro
    mapLink: 'https://maps.app.goo.gl/vXB9ezPd49HmbC9eA'
  },
  {
    id: 'unidade2',
    name: 'Unidade 2 - Templo Nambei',
    address: 'R. Carvalho, 319 - Cidade Jardim, Campo Grande - MS',
    position: [-20.458923, -54.583091] as [number, number], // Approx coordinates for Cidade Jardim
    mapLink: 'https://maps.app.goo.gl/dtnrdk3MXYSwZsdc8'
  }
];

export default function MapComponent({ selectedUnidade = 'unidade1' }: { selectedUnidade?: 'unidade1' | 'unidade2' }) {
  const [mounted, setMounted] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (map) {
      const location = LOCATIONS.find(l => l.id === selectedUnidade);
      if (location) {
        map.setView(location.position, 14, { animate: true });
      }
    }
  }, [selectedUnidade, map]);

  if (!mounted) {
    return <div className="w-full h-96 bg-orange-100/50 rounded-xl animate-pulse flex items-center justify-center">
      <span className="text-orange-400 font-bold">Carregando mapa...</span>
    </div>;
  }

  const centerPosition = LOCATIONS.find(l => l.id === selectedUnidade)?.position || LOCATIONS[0].position;

  return (
    <div className="w-full h-96 sm:h-[400px] md:h-[500px] rounded-3xl overflow-hidden border border-orange-200 shadow-xl shadow-orange-900/5 relative z-0">
      <MapContainer 
        center={centerPosition} 
        zoom={14} 
        style={{ height: '100%', width: '100%' }}
        ref={setMap}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
        />
        
        {LOCATIONS.map((location) => (
          <Marker 
            key={location.id} 
            position={location.position} 
            icon={customIcon}
          >
            <Popup className="custom-popup">
              <div className="p-1">
                <h3 className="font-bold text-orange-900 mb-1 text-base">{location.name}</h3>
                <p className="text-xs text-gray-600 mb-3">{location.address}</p>
                <a 
                  href={location.mapLink} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="bg-orange-600 hover:bg-orange-700 text-white text-xs font-bold py-2 px-3 rounded-lg flex items-center justify-center gap-1.5 transition-colors no-underline"
                >
                  <Navigation size={14} /> Traçar Rota
                </a>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
