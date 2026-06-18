import { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { fetchExcelData } from '../utils/excelUtils';
import { Briefcase } from 'lucide-react';
import { renderToString } from 'react-dom/server';

// Fix for default marker icon in react-leaflet
delete L.Icon.Default.prototype._getIconUrl;

// Custom premium marker icon
const customIcon = new L.Icon({
  iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  tooltipAnchor: [16, -28],
  shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  shadowSize: [41, 41],
  className: 'custom-map-marker'
});

const ClientMap = () => {
  const [clients, setClients] = useState([]);

  useEffect(() => {
    const loadClients = async () => {
      const data = await fetchExcelData('clients.xlsx');
      setClients(data);
    };
    loadClients();
  }, []);

  return (
    <div className="w-full h-[500px] rounded-[2rem] overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-gray-100 relative z-10 bg-[#FAFAFA]">
      <MapContainer 
        center={[25.0, 30.0]} 
        zoom={2.5} 
        scrollWheelZoom={false}
        className="w-full h-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://stadiamaps.com/">Stadia Maps</a>'
          url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
        />
        
        {clients.map((client, idx) => {
          if (!client.Latitude || !client.Longitude) return null;
          return (
            <Marker 
              key={idx} 
              position={[client.Latitude, client.Longitude]}
              icon={customIcon}
            >
              <Tooltip direction="top" offset={[0, -10]} opacity={1} className="premium-tooltip">
                <div className="p-1 min-w-[120px]">
                  <h3 className="font-bold text-gray-900 text-sm mb-0.5">{client['Client Name'] || client.City}</h3>
                  <p className="text-gray-500 text-xs mb-2">{client.City}, {client.Country}</p>
                  <div className="flex items-center gap-1 text-xs font-semibold text-brand-primary bg-brand-lightest/50 px-2 py-1 rounded">
                    Projects: {client['Project Count'] || 1}
                  </div>
                </div>
              </Tooltip>
            </Marker>
          );
        })}
      </MapContainer>
      
      <style>{`
        .custom-map-marker {
          filter: hue-rotate(220deg) saturate(2) drop-shadow(0 4px 6px rgba(0,0,0,0.2));
        }
        .leaflet-tooltip.premium-tooltip {
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(8px);
          border: 1px solid rgba(0,0,0,0.05);
          border-radius: 12px;
          box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
          padding: 8px;
        }
        .leaflet-tooltip-top:before {
          border-top-color: rgba(255, 255, 255, 0.95);
        }
      `}</style>
    </div>
  );
};

export default ClientMap;
