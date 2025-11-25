import React, { useState, useCallback, useRef } from 'react';
import { MapContainer, TileLayer, Marker, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Button } from '../atoms';

// Fix for default marker icons in Leaflet with Vite
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

interface LocationPickerProps {
  value?: [number, number];
  onChange: (coords: [number, number]) => void;
  defaultCenter?: [number, number];
  zoom?: number;
  height?: string;
  className?: string;
  disabled?: boolean;
  showCoordinates?: boolean;
  showCurrentLocationButton?: boolean;
}

// Component to handle map clicks and place marker
function MapClickHandler({
  onLocationSelect,
  disabled,
}: {
  onLocationSelect: (coords: [number, number]) => void;
  disabled?: boolean;
}) {
  useMapEvents({
    click(e) {
      if (!disabled) {
        onLocationSelect([e.latlng.lat, e.latlng.lng]);
      }
    },
  });
  return null;
}

const LocationPicker: React.FC<LocationPickerProps> = ({
  value,
  onChange,
  defaultCenter = [-17.3935, -66.1570], // Cochabamba, Bolivia
  zoom = 13,
  height = '400px',
  className = '',
  disabled = false,
  showCoordinates = true,
  showCurrentLocationButton = true,
}) => {
  const [isGettingLocation, setIsGettingLocation] = useState(false);
  const [geolocationError, setGeolocationError] = useState<string | null>(null);
  const markerRef = useRef<L.Marker>(null);

  const currentPosition = value || defaultCenter;

  const handleLocationSelect = useCallback(
    (coords: [number, number]) => {
      if (!disabled) {
        onChange(coords);
      }
    },
    [onChange, disabled]
  );

  const handleMarkerDragEnd = useCallback(() => {
    const marker = markerRef.current;
    if (marker && !disabled) {
      const position = marker.getLatLng();
      onChange([position.lat, position.lng]);
    }
  }, [onChange, disabled]);

  const handleGetCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setGeolocationError('La geolocalización no está soportada en este navegador');
      return;
    }

    setIsGettingLocation(true);
    setGeolocationError(null);

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const coords: [number, number] = [
          position.coords.latitude,
          position.coords.longitude,
        ];
        onChange(coords);
        setIsGettingLocation(false);
      },
      (error) => {
        let errorMessage = 'No se pudo obtener la ubicación';
        switch (error.code) {
          case error.PERMISSION_DENIED:
            errorMessage = 'Permiso de ubicación denegado';
            break;
          case error.POSITION_UNAVAILABLE:
            errorMessage = 'Ubicación no disponible';
            break;
          case error.TIMEOUT:
            errorMessage = 'Tiempo de espera agotado';
            break;
        }
        setGeolocationError(errorMessage);
        setIsGettingLocation(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 0,
      }
    );
  }, [onChange]);

  return (
    <div className={`space-y-3 ${className}`}>
      {/* Map Container */}
      <div
        className={`relative z-0 rounded-lg overflow-hidden border border-border ${
          disabled ? 'opacity-60 pointer-events-none' : ''
        }`}
        style={{ height }}
      >
        <MapContainer
          center={currentPosition}
          zoom={zoom}
          style={{ height: '100%', width: '100%' }}
          scrollWheelZoom={!disabled}
          dragging={!disabled}
          doubleClickZoom={!disabled}
          touchZoom={!disabled}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />

          {/* Click handler to place marker */}
          <MapClickHandler onLocationSelect={handleLocationSelect} disabled={disabled} />

          {/* Draggable marker */}
          {currentPosition && (
            <Marker
              position={currentPosition}
              draggable={!disabled}
              eventHandlers={{
                dragend: handleMarkerDragEnd,
              }}
              ref={markerRef}
            />
          )}
        </MapContainer>
      </div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        {/* Current Location Button */}
        {showCurrentLocationButton && (
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="secondary"
              size="sm"
              onClick={handleGetCurrentLocation}
              disabled={disabled || isGettingLocation}
            >
              {isGettingLocation ? (
                <>
                  <span className="inline-block animate-spin mr-2">⟳</span>
                  Obteniendo ubicación...
                </>
              ) : (
                <>
                  <span className="mr-2">📍</span>
                  Usar mi ubicación
                </>
              )}
            </Button>
            {geolocationError && (
              <span className="text-sm text-error">{geolocationError}</span>
            )}
          </div>
        )}

        {/* Coordinates Display */}
        {showCoordinates && currentPosition && (
          <div className="text-sm text-muted-foreground">
            <span className="font-medium">📍 Ubicación:</span>{' '}
            <span className="font-mono">
              {currentPosition[0].toFixed(6)}, {currentPosition[1].toFixed(6)}
            </span>
          </div>
        )}
      </div>

      {/* Helper text */}
      {!disabled && (
        <p className="text-xs text-muted-foreground">
          Haz clic en el mapa o arrastra el marcador para seleccionar una ubicación
        </p>
      )}
    </div>
  );
};

export default LocationPicker;
