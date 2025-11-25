import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, MapContainerProps } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Fix for default marker icons in Leaflet with Webpack/Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface MapMarker {
  position: [number, number];
  title: string;
  description?: string;
}

interface MapProps extends Omit<MapContainerProps, 'center' | 'zoom'> {
  center?: [number, number];
  zoom?: number;
  markers?: MapMarker[];
  height?: string;
  className?: string;
}

const Map: React.FC<MapProps> = ({
  center = [-17.3935, -66.1570], // Cochabamba, Bolivia coordinates by default
  zoom = 13,
  markers = [],
  height = '400px',
  className = '',
  ...mapContainerProps
}) => {
  return (
    <div className={`rounded-lg overflow-hidden border border-border ${className}`} style={{ height }}>
      <MapContainer
        center={center}
        zoom={zoom}
        style={{ height: '100%', width: '100%' }}
        {...mapContainerProps}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {markers.map((marker, index) => (
          <Marker key={index} position={marker.position}>
            <Popup>
              <div className="text-sm">
                <strong className="block mb-1">{marker.title}</strong>
                {marker.description && <p className="text-muted-foreground">{marker.description}</p>}
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
};

export default Map;
