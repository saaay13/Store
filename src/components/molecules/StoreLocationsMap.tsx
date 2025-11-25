import React, { useMemo } from 'react';
import Map from '../atoms/Map';
import type { StoreLocation } from '../../types';

interface StoreLocationsMapProps {
  locations: StoreLocation[];
  height?: string;
  className?: string;
  defaultCenter?: [number, number];
  defaultZoom?: number;
}

const StoreLocationsMap: React.FC<StoreLocationsMapProps> = ({
  locations,
  height = '500px',
  className = '',
  defaultCenter,
  defaultZoom = 13,
}) => {
  // Calculate center based on locations or use default
  const center: [number, number] = useMemo(() => {
    if (defaultCenter) return defaultCenter;

    if (locations.length === 0) {
      return [-17.3935, -66.1570]; // Cochabamba default
    }

    if (locations.length === 1) {
      return [locations[0].latitude, locations[0].longitude];
    }

    // Calculate average position for multiple locations
    const avgLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length;
    const avgLng = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length;

    return [avgLat, avgLng];
  }, [locations, defaultCenter]);

  // Convert store locations to map markers
  const markers = useMemo(() => {
    return locations.map(location => ({
      position: [location.latitude, location.longitude] as [number, number],
      title: location.name,
      description: `${location.address}, ${location.city}${location.openingHours ? ` | ${location.openingHours}` : ''}`,
    }));
  }, [locations]);

  return (
    <Map
      center={center}
      zoom={defaultZoom}
      markers={markers}
      height={height}
      className={className}
    />
  );
};

export default StoreLocationsMap;
