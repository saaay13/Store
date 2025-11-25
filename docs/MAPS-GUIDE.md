# Guía de Mapas con Leaflet

Esta guía explica cómo usar **Leaflet** y los componentes de mapas en el proyecto de la librería.

## 📚 Tabla de Contenidos

1. [Introducción](#introducción)
2. [Instalación y Configuración](#instalación-y-configuración)
3. [Componentes de Mapas](#componentes-de-mapas)
4. [Tipos y Entidades](#tipos-y-entidades)
5. [Ejemplos de Uso](#ejemplos-de-uso)
6. [Personalización](#personalización)
7. [Buenas Prácticas](#buenas-prácticas)
8. [Troubleshooting](#troubleshooting)

---

## Introducción

Este proyecto utiliza **[Leaflet](https://leafletjs.com/)**, una librería JavaScript de código abierto para mapas interactivos móviles y web. Leaflet es ligera, eficiente y proporciona todas las características necesarias para mostrar mapas en el proyecto.

### ¿Por qué Leaflet?

- ✅ **Ligera**: ~42KB de JavaScript comprimido
- ✅ **Fácil de usar**: API simple e intuitiva
- ✅ **Open Source**: Sin costos de API como Google Maps
- ✅ **Compatible**: Funciona en todos los navegadores modernos y móviles
- ✅ **Personalizable**: Completamente estilizable con CSS
- ✅ **Extensible**: Gran ecosistema de plugins

### React Leaflet

Usamos **[react-leaflet](https://react-leaflet.js.org/)** como wrapper de React para Leaflet, que proporciona componentes React para trabajar con mapas de forma declarativa.

---

## Instalación y Configuración

### Dependencias Instaladas

```bash
npm install leaflet react-leaflet
npm install -D @types/leaflet
```

### Importar Estilos CSS

Los estilos de Leaflet se importan en los componentes que usan mapas:

```typescript
import 'leaflet/dist/leaflet.css';
```

### Fix de Iconos de Marcadores

Leaflet tiene un problema conocido con los iconos de marcadores cuando se usa con bundlers como Vite. Los componentes incluyen un fix automático:

```typescript
import L from 'leaflet';
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});
```

---

## Componentes de Mapas

El proyecto incluye cuatro componentes siguiendo la arquitectura atómica:

- **Map** (Atom): Componente base de mapa reutilizable
- **StoreLocationsMap** (Molecule): Mapa especializado para sucursales
- **LocationPicker** (Molecule): Selector interactivo de ubicación
- **LocationFormField** (Molecule): Campo de formulario con mapa integrado

### 1. Map (Atom) - Componente Base

**Ubicación:** `src/components/atoms/Map.tsx`

Componente base reutilizable para mostrar cualquier tipo de mapa.

#### Props

```typescript
interface MapMarker {
  position: [number, number];  // [latitud, longitud]
  title: string;
  description?: string;
}

interface MapProps extends Omit<MapContainerProps, 'center' | 'zoom'> {
  center?: [number, number];    // Centro del mapa [lat, lng]
  zoom?: number;                // Nivel de zoom (1-18)
  markers?: MapMarker[];        // Array de marcadores
  height?: string;              // Altura del mapa (CSS)
  className?: string;           // Clases adicionales
}
```

#### Valores por Defecto

- **center**: `[-17.3935, -66.1570]` (Cochabamba, Bolivia)
- **zoom**: `13`
- **height**: `"400px"`
- **markers**: `[]`

#### Ejemplo Básico

```tsx
import { Map } from '../components/atoms';

const markers = [
  {
    position: [-17.3935, -66.1570],
    title: "Mi Ubicación",
    description: "Descripción del lugar"
  }
];

<Map
  center={[-17.3935, -66.1570]}
  zoom={15}
  markers={markers}
  height="500px"
/>
```

#### Características

- ✅ Mapas base de OpenStreetMap (sin costo)
- ✅ Marcadores con popups informativos
- ✅ Completamente interactivo (zoom, pan, etc.)
- ✅ Integrado con sistema de colores (border-border)
- ✅ Bordes redondeados y responsivo

---

### 2. StoreLocationsMap (Molecule) - Mapa de Sucursales

**Ubicación:** `src/components/molecules/StoreLocationsMap.tsx`

Componente especializado para mostrar ubicaciones de sucursales de la tienda.

#### Props

```typescript
interface StoreLocationsMapProps {
  locations: StoreLocation[];    // Array de sucursales
  height?: string;               // Altura del mapa
  className?: string;            // Clases adicionales
  defaultCenter?: [number, number];  // Centro predeterminado
  defaultZoom?: number;          // Zoom predeterminado
}
```

#### Valores por Defecto

- **height**: `"500px"`
- **defaultZoom**: `13`
- **defaultCenter**: Se calcula automáticamente según las ubicaciones

#### Ejemplo de Uso

```tsx
import { StoreLocationsMap } from '../components/molecules';
import type { StoreLocation } from '../types';

const locations: StoreLocation[] = [
  {
    locationId: 1,
    name: "Sucursal Principal",
    address: "Calle Colombia #1069",
    city: "Cochabamba",
    phone: "+591 4 4234567",
    email: "info@libros.com",
    latitude: -17.3935,
    longitude: -66.1570,
    openingHours: "Lun-Vie: 10:00-19:00",
    isPrimary: true
  }
];

<StoreLocationsMap
  locations={locations}
  height="600px"
  defaultZoom={12}
/>
```

#### Funcionalidades Inteligentes

**1. Centro Automático:**
- Si hay 1 ubicación: centra en esa ubicación
- Si hay múltiples: calcula el promedio de coordenadas
- Si no hay ubicaciones: usa Cochabamba por defecto

**2. Conversión Automática:**
- Convierte objetos `StoreLocation` en marcadores del mapa
- Combina información (dirección, horarios) en el popup

**3. Información en Popups:**
```
[Nombre de la Sucursal]
[Dirección], [Ciudad] | [Horarios]
```

---

### 3. LocationPicker (Molecule) - Selector de Ubicación

**Ubicación:** `src/components/molecules/LocationPicker.tsx`

Componente interactivo para seleccionar coordenadas geográficas en un mapa. Ideal para formularios donde el usuario necesita especificar una ubicación.

#### Props

```typescript
interface LocationPickerProps {
  value?: [number, number];           // Coordenadas actuales [lat, lng]
  onChange: (coords: [number, number]) => void;  // Callback al cambiar
  defaultCenter?: [number, number];   // Centro inicial del mapa
  zoom?: number;                      // Nivel de zoom inicial
  height?: string;                    // Altura del mapa (CSS)
  className?: string;                 // Clases adicionales
  disabled?: boolean;                 // Deshabilitar interacción
  showCoordinates?: boolean;          // Mostrar coordenadas debajo del mapa
  showCurrentLocationButton?: boolean; // Mostrar botón de geolocalización
}
```

#### Valores por Defecto

- **defaultCenter**: `[-17.3935, -66.1570]` (Cochabamba)
- **zoom**: `13`
- **height**: `"400px"`
- **showCoordinates**: `true`
- **showCurrentLocationButton**: `true`

#### Funcionalidades

✅ **Click en el Mapa**: Coloca el marcador en la ubicación clickeada
✅ **Marcador Arrastrable**: Arrastra y suelta para ajustar la posición
✅ **Geolocalización**: Botón "Usar mi ubicación" con GPS del navegador
✅ **Display de Coordenadas**: Muestra lat/lng en tiempo real
✅ **Controlled Component**: Integración perfecta con formularios
✅ **Manejo de Errores**: Mensajes claros si geolocalización falla

#### Ejemplo Básico

```tsx
import { useState } from 'react';
import { LocationPicker } from '../components/molecules';

function MyComponent() {
  const [location, setLocation] = useState<[number, number]>([-17.3935, -66.1570]);

  return (
    <LocationPicker
      value={location}
      onChange={setLocation}
      height="400px"
      showCurrentLocationButton={true}
    />
  );
}
```

#### Ejemplo en Formulario

```tsx
const [formData, setFormData] = useState({
  name: '',
  address: '',
  coordinates: [-17.3935, -66.1570] as [number, number]
});

const handleLocationChange = (coords: [number, number]) => {
  setFormData(prev => ({ ...prev, coordinates: coords }));
};

<form>
  <input
    type="text"
    value={formData.name}
    onChange={e => setFormData({...formData, name: e.target.value})}
  />

  <LocationPicker
    value={formData.coordinates}
    onChange={handleLocationChange}
    height="350px"
  />
</form>
```

---

### 4. LocationFormField (Molecule) - Campo de Formulario para Ubicación

**Ubicación:** `src/components/molecules/LocationFormField.tsx`

FormField especializado que integra `LocationPicker` con el sistema de formularios del proyecto. Incluye label, validación, mensajes de error y opción de entrada manual de coordenadas.

#### Props

```typescript
interface LocationFormFieldProps {
  label: string;                      // Etiqueta del campo
  name: string;                       // Nombre del campo (para forms)
  value?: [number, number];           // Coordenadas actuales
  onChange: (coords: [number, number]) => void;  // Callback
  error?: string;                     // Mensaje de error
  helperText?: string;                // Texto de ayuda
  required?: boolean;                 // Campo requerido
  disabled?: boolean;                 // Deshabilitar campo
  mapHeight?: string;                 // Altura del mapa
  defaultCenter?: [number, number];   // Centro inicial
  showManualInput?: boolean;          // Mostrar campos de entrada manual
  className?: string;
}
```

#### Valores por Defecto

- **mapHeight**: `"400px"`
- **defaultCenter**: `[-17.3935, -66.1570]`
- **required**: `false`
- **showManualInput**: `false`

#### Características Únicas

✅ **Integración con FormField**: Mismo estilo visual que otros campos del formulario
✅ **Entrada Manual Opcional**: Toggle para mostrar campos lat/lng editables
✅ **Validación Automática**: Valida rango de coordenadas (-90/90, -180/180)
✅ **Mensajes de Error**: Display consistente con otros FormFields
✅ **Label y Required**: Indica campos obligatorios con asterisco
✅ **Helper Text**: Texto descriptivo debajo del campo

#### Ejemplo Completo

```tsx
import { useState } from 'react';
import { LocationFormField } from '../components/molecules';
import { Button } from '../components/atoms';
import type { StoreLocation } from '../types';

function CreateStoreForm() {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    city: '',
    phone: '',
    email: '',
  });

  const [location, setLocation] = useState<[number, number]>([-17.3935, -66.1570]);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validación
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = 'El nombre es requerido';
    if (!location) newErrors.location = 'Debe seleccionar una ubicación';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    // Crear objeto StoreLocation
    const newStore: Partial<StoreLocation> = {
      ...formData,
      latitude: location[0],
      longitude: location[1],
      isPrimary: false
    };

    // Enviar a API
    await createStore(newStore);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <FormField
        label="Nombre de la Sucursal"
        name="name"
        value={formData.name}
        onChange={(e) => setFormData({...formData, name: e.target.value})}
        error={errors.name}
        required
      />

      <FormField
        label="Dirección"
        name="address"
        value={formData.address}
        onChange={(e) => setFormData({...formData, address: e.target.value})}
        required
      />

      <LocationFormField
        label="Ubicación en el mapa"
        name="location"
        value={location}
        onChange={setLocation}
        error={errors.location}
        helperText="Haz clic en el mapa o arrastra el marcador para seleccionar la ubicación exacta"
        mapHeight="450px"
        showManualInput={true}
        required
      />

      <FormField
        label="Teléfono"
        name="phone"
        type="tel"
        value={formData.phone}
        onChange={(e) => setFormData({...formData, phone: e.target.value})}
        required
      />

      <Button type="submit">Crear Sucursal</Button>
    </form>
  );
}
```

#### Entrada Manual de Coordenadas

Cuando `showManualInput={true}`, el usuario puede:

1. Click en "Entrada manual de coordenadas" para mostrar campos
2. Escribir latitud y longitud directamente
3. Click en "Aplicar coordenadas" para actualizar el mapa
4. La validación se ejecuta automáticamente

```tsx
<LocationFormField
  label="Ubicación"
  name="location"
  value={location}
  onChange={setLocation}
  showManualInput={true}  // Habilita entrada manual
/>
```

#### Validación de Coordenadas

El componente valida automáticamente:

- **Latitud**: Debe estar entre -90 y 90
- **Longitud**: Debe estar entre -180 y 180
- **Formato**: Deben ser números válidos

Mensajes de error se muestran automáticamente si la validación falla.

---

## Tipos y Entidades

### StoreLocation

**Ubicación:** `src/types/entities/store-location.ts`

```typescript
interface StoreLocation {
  locationId: number;
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  latitude: number;     // Coordenada geográfica
  longitude: number;    // Coordenada geográfica
  openingHours?: string;
  description?: string;
  isPrimary: boolean;   // Indica si es la sucursal principal

  // Campos legacy en español (compatibilidad)
  sucursal_id?: number;
  nombre?: string;
  direccion?: string;
  ciudad?: string;
  telefono?: string;
  latitud?: number;
  longitud?: number;
  horarios?: string;
  descripcion?: string;
  es_principal?: boolean;
}
```

### Operaciones CRUD

```typescript
interface CreateStoreLocation {
  name: string;
  address: string;
  city: string;
  phone: string;
  email?: string;
  latitude: number;
  longitude: number;
  openingHours?: string;
  description?: string;
  isPrimary?: boolean;
}

interface UpdateStoreLocation extends Partial<CreateStoreLocation> {
  locationId: number;
}
```

**Exportación centralizada:**

```typescript
import type { StoreLocation, CreateStoreLocation, UpdateStoreLocation } from '@/types';
```

---

## Ejemplos de Uso

### Ejemplo 1: Mapa Simple con un Marcador

```tsx
import { Map } from '../components/atoms';

function ContactPage() {
  return (
    <div>
      <h2>Nuestra Ubicación</h2>
      <Map
        center={[-17.3935, -66.1570]}
        zoom={16}
        markers={[
          {
            position: [-17.3935, -66.1570],
            title: "Librería Principal",
            description: "Calle Colombia #1069, Cochabamba"
          }
        ]}
        height="400px"
      />
    </div>
  );
}
```

### Ejemplo 2: Múltiples Sucursales

```tsx
import { StoreLocationsMap } from '../components/molecules';
import { Card } from '../components/atoms';
import type { StoreLocation } from '../types';

function LocationsPage() {
  const locations: StoreLocation[] = [
    {
      locationId: 1,
      name: "Sucursal Centro",
      address: "Calle Colombia #1069",
      city: "Cochabamba",
      phone: "+591 4 4234567",
      latitude: -17.3935,
      longitude: -66.1570,
      isPrimary: true
    },
    {
      locationId: 2,
      name: "Sucursal Norte",
      address: "Av. Blanco Galindo Km 4.5",
      city: "Cochabamba",
      phone: "+591 4 4234568",
      latitude: -17.3700,
      longitude: -66.1700,
      isPrimary: false
    }
  ];

  return (
    <div className="space-y-8">
      <h1>Nuestras Sucursales</h1>

      {/* Mapa interactivo */}
      <StoreLocationsMap
        locations={locations}
        height="500px"
        defaultZoom={12}
      />

      {/* Lista de sucursales */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {locations.map(location => (
          <Card key={location.locationId}>
            <h3>{location.name}</h3>
            <p>{location.address}</p>
            <p>{location.phone}</p>
          </Card>
        ))}
      </div>
    </div>
  );
}
```

### Ejemplo 3: Integración en HomePage

Ver implementación completa en: `src/pages/Home.tsx:347-409`

```tsx
import { StoreLocationsMap } from "../components/molecules";
import { Card, Icon } from "../components/atoms";
import type { StoreLocation } from "../types";

// Datos de sucursales (puede venir de API o context)
const storeLocations: StoreLocation[] = [ /* ... */ ];

// En el JSX:
<section className="py-16 px-4 sm:px-6 lg:px-8">
  <div className="max-w-7xl mx-auto space-y-10">
    {/* Título y descripción */}
    <div className="text-center space-y-4">
      <h2 className="text-3xl font-bold">Nuestras Sucursales</h2>
      <p className="text-lg text-muted-foreground">
        Visítanos en cualquiera de nuestras ubicaciones
      </p>
    </div>

    {/* Mapa */}
    <StoreLocationsMap
      locations={storeLocations}
      height="500px"
      defaultZoom={12}
    />

    {/* Tarjetas de información */}
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {storeLocations.map((location) => (
        <Card key={location.locationId}>
          {location.isPrimary && (
            <span className="badge">Sucursal Principal</span>
          )}
          <h3>{location.name}</h3>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Icon name="clock" size="sm" />
              <span>{location.openingHours}</span>
            </div>
            <div className="flex items-center gap-2">
              <Icon name="phone" size="sm" />
              <span>{location.phone}</span>
            </div>
          </div>
        </Card>
      ))}
    </div>
  </div>
</section>
```

### Ejemplo 4: Mapa con Datos Dinámicos

```tsx
import { useState, useEffect } from 'react';
import { StoreLocationsMap } from '../components/molecules';
import { Spinner } from '../components/atoms';
import type { StoreLocation } from '../types';

function DynamicMapPage() {
  const [locations, setLocations] = useState<StoreLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simular llamada a API
    fetch('/api/store-locations')
      .then(res => res.json())
      .then(data => {
        setLocations(data);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <Spinner size="lg" />;
  }

  return (
    <div>
      <h2>Encuentra tu sucursal más cercana</h2>
      <StoreLocationsMap
        locations={locations}
        height="600px"
      />
    </div>
  );
}
```

---

## Personalización

### Cambiar Proveedor de Tiles

Por defecto, usamos OpenStreetMap. Puedes cambiar a otros proveedores editando el componente `Map.tsx`:

```tsx
// OpenStreetMap (actual)
<TileLayer
  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
/>

// CartoDB Positron (claro)
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
/>

// CartoDB Dark Matter (oscuro)
<TileLayer
  url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
/>

// Stamen Terrain (topográfico)
<TileLayer
  url="https://stamen-tiles-{s}.a.ssl.fastly.net/terrain/{z}/{x}/{y}{r}.png"
  attribution='Map tiles by <a href="http://stamen.com">Stamen Design</a>'
/>
```

### Iconos Personalizados

Para usar iconos personalizados de marcadores:

```tsx
import L from 'leaflet';

const customIcon = new L.Icon({
  iconUrl: '/icons/custom-marker.png',
  iconRetinaUrl: '/icons/custom-marker-2x.png',
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

// En el marcador:
<Marker position={position} icon={customIcon}>
  <Popup>{title}</Popup>
</Marker>
```

### Estilos de Popup

Los popups heredan estilos del sistema de colores del proyecto. Para personalizarlos:

```tsx
<Popup>
  <div className="text-sm">
    <strong className="block mb-1 text-primary">{title}</strong>
    <p className="text-muted-foreground">{description}</p>
    <a href="#" className="text-primary hover:underline mt-2 block">
      Ver detalles
    </a>
  </div>
</Popup>
```

### Altura Responsiva

```tsx
// Altura fija
<Map height="400px" />

// Altura responsive con Tailwind
<div className="h-64 md:h-96 lg:h-[500px]">
  <Map height="100%" />
</div>

// Altura viewport
<Map height="80vh" />
```

---

## Buenas Prácticas

### 1. Coordenadas

✅ **Correcto:**
```typescript
// Formato: [latitud, longitud]
const position: [number, number] = [-17.3935, -66.1570];
```

❌ **Incorrecto:**
```typescript
// NO invertir el orden
const position = [-66.1570, -17.3935]; // ❌ INCORRECTO
```

### 2. Performance

**Limitar número de marcadores:**
```tsx
// Para muchos marcadores, considera clustering
import MarkerClusterGroup from 'react-leaflet-cluster';

<MarkerClusterGroup>
  {locations.map(loc => (
    <Marker key={loc.locationId} position={[loc.latitude, loc.longitude]} />
  ))}
</MarkerClusterGroup>
```

**Lazy loading:**
```tsx
import { lazy, Suspense } from 'react';

const Map = lazy(() => import('../components/atoms/Map'));

<Suspense fallback={<Spinner />}>
  <Map center={center} markers={markers} />
</Suspense>
```

### 3. Accesibilidad

```tsx
// Agregar aria-label descriptivo
<div aria-label="Mapa interactivo mostrando ubicaciones de sucursales">
  <Map markers={markers} />
</div>

// Información alternativa para lectores de pantalla
<div className="sr-only">
  {locations.map(loc => (
    <div key={loc.locationId}>
      {loc.name}: {loc.address}, {loc.city}
    </div>
  ))}
</div>
```

### 4. Validación de Coordenadas

```typescript
function isValidCoordinate(lat: number, lng: number): boolean {
  return lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
}

// Antes de crear un marcador:
if (isValidCoordinate(location.latitude, location.longitude)) {
  // Crear marcador
}
```

### 5. Manejo de Errores

```tsx
function SafeMap({ locations }: { locations: StoreLocation[] }) {
  const validLocations = locations.filter(loc =>
    loc.latitude && loc.longitude &&
    isValidCoordinate(loc.latitude, loc.longitude)
  );

  if (validLocations.length === 0) {
    return <Alert variant="warning">No hay ubicaciones para mostrar</Alert>;
  }

  return <StoreLocationsMap locations={validLocations} />;
}
```

---

## Troubleshooting

### Problema: Iconos de marcadores no se muestran

**Síntoma:** Los marcadores aparecen como cuadrados rotos.

**Solución:** El fix de iconos ya está implementado en `Map.tsx`. Si persiste:

```typescript
// Asegúrate de que las imágenes estén en public/
import markerIcon from '/marker-icon.png';
// O copia manualmente a public/leaflet/
```

### Problema: El mapa no se renderiza

**Síntoma:** Contenedor vacío o error de consola.

**Solución 1:** Verifica que el contenedor tenga altura:
```tsx
<div style={{ height: '400px' }}>
  <Map />
</div>
```

**Solución 2:** Llama `map.invalidateSize()` si el contenedor cambia de tamaño:
```tsx
import { useMap } from 'react-leaflet';

function ResizeHandler() {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  return null;
}

// Dentro de MapContainer:
<MapContainer>
  <ResizeHandler />
  {/* otros componentes */}
</MapContainer>
```

### Problema: Centro del mapa incorrecto

**Síntoma:** El mapa no centra correctamente con múltiples marcadores.

**Solución:** `StoreLocationsMap` calcula el centro automáticamente. Si necesitas ajustar:

```tsx
// Calcular bounds manualmente
import { LatLngBounds } from 'leaflet';

const bounds = new LatLngBounds(
  locations.map(loc => [loc.latitude, loc.longitude])
);

// Usar en MapContainer
<MapContainer bounds={bounds} boundsOptions={{ padding: [50, 50] }}>
  {/* ... */}
</MapContainer>
```

### Problema: Popups no se muestran correctamente en dark mode

**Solución:** Los popups heredan los estilos del tema. Si necesitas forzar colores:

```css
/* En tu CSS global o component */
.leaflet-popup-content-wrapper {
  background-color: var(--card);
  color: var(--card-foreground);
}

.leaflet-popup-tip {
  background-color: var(--card);
}
```

### Problema: El mapa se carga lentamente

**Solución 1:** Lazy loading del componente:
```tsx
const Map = lazy(() => import('../components/atoms/Map'));
```

**Solución 2:** Usar `preferCanvas` en MapContainer:
```tsx
<MapContainer preferCanvas={true}>
  {/* ... */}
</MapContainer>
```

---

## Referencias

### Documentación Oficial

- **Leaflet:** https://leafletjs.com/reference.html
- **React Leaflet:** https://react-leaflet.js.org/docs/start-introduction
- **OpenStreetMap:** https://www.openstreetmap.org/

### Recursos Adicionales

- **Tile Providers:** https://leaflet-extras.github.io/leaflet-providers/preview/
- **Plugins:** https://leafletjs.com/plugins.html
- **Ejemplos:** https://react-leaflet.js.org/docs/example-popup-marker

### Archivos Relacionados

- `src/components/atoms/Map.tsx` - Componente base
- `src/components/molecules/StoreLocationsMap.tsx` - Componente de sucursales
- `src/types/entities/store-location.ts` - Tipos de datos
- `src/pages/Home.tsx` - Ejemplo de implementación
- `docs/COLOR-SYSTEM-GUIDE.md` - Sistema de colores

---

## Preguntas Frecuentes

### ¿Puedo usar Google Maps en lugar de Leaflet?

Sí, pero Google Maps tiene costos después de cierto uso. Leaflet con OpenStreetMap es gratuito y suficiente para la mayoría de casos.

### ¿Cómo obtengo las coordenadas de una dirección?

Usa servicios de geocoding:
- **OpenStreetMap Nominatim:** https://nominatim.openstreetmap.org/
- Busca la dirección y obtendrás lat/lng

### ¿Funciona offline?

Los tiles del mapa requieren conexión. Para uso offline, necesitas configurar tiles locales (avanzado).

### ¿Es responsive?

Sí, los mapas son completamente responsive. Usan `width: 100%` y la altura que especifiques.

### ¿Puedo agregar más funcionalidades?

Sí, Leaflet tiene muchos plugins disponibles. Algunos útiles:
- `react-leaflet-cluster` - Clustering de marcadores
- `leaflet-routing-machine` - Rutas entre puntos
- `leaflet-draw` - Dibujar en el mapa
- `leaflet-fullscreen` - Modo pantalla completa

---

**Última actualización:** Noviembre 2025
**Mantenido por:** Equipo de desarrollo
**Versión de Leaflet:** 1.9.x
**Versión de React Leaflet:** 4.2.x
