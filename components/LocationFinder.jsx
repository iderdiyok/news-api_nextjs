import { useEffect, useState } from 'react';

import {
  Circle,
  LayerGroup,
  MapContainer,
  Marker,
  Popup,
  TileLayer,
  useMap,
} from 'react-leaflet';
import cimdataLocations from '@/library/cimdataLocations';

import MasterClusterGroup from '@changey/react-leaflet-markercluster';
import { getDistance } from '@/library/helpers';

const defaultCenter = { lat: 51.1864708, lng: 10.0671016 };
const defaultZoom = 6;

// Prüfen, ob das Gerät Geolocation unterstützt
const navigatorAvailable = Boolean(window?.navigator?.geolocation);

export default function LocationFinder() {
  const [mapCenter, setMapCenter] = useState(defaultCenter);
  const [zoom, setZoom] = useState(defaultZoom);
  const [userLocation, setUserLocation] = useState(null);
  const [locations, setLocations] = useState(cimdataLocations);

  async function showNearLocations() {
    try {
      const location = await getUserLocation();

      const userCenter = {
        lat: location.coords.latitude,
        lng: location.coords.longitude,
      };

      const locationsInRadius = getLocationsInRadius(userCenter);
      setLocations(locationsInRadius);
      setUserLocation(userCenter);
      setMapCenter(userCenter);
      setZoom(9);
    } catch (error) {
      console.log(error);
    }
  }
  const reset = () => {
    setLocations(cimdataLocations);
    setZoom(defaultZoom);
    setMapCenter(defaultCenter);
    setUserLocation(null);
  };

  return (
    <section>
      {navigatorAvailable && (
        <>
          <button onClick={showNearLocations}>
            Zeige Standorte in meiner nähe
          </button>
          <button onClick={reset}>Zeige alle Standorte</button>
        </>
      )}

      <MapContainer center={mapCenter} zoom={zoom} scrollWheelZoom={false}>
        <MapController center={mapCenter} zoom={zoom} />
        <TileLayer
          attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {userLocation && (
          <LayerGroup>
            {/* <Popup>
              <strong>Ihr Standort</strong>
            </Popup> */}
            <Circle
              center={[userLocation.lat, userLocation.lng]}
              pathOptions={{ color: 'red', fillColor: 'red' }}
              radius={2000}
            />
          </LayerGroup>
        )}

        <MasterClusterGroup>
          {locations.map(({ title, latLng }) => (
            <Marker key={title} position={latLng}>
              <Popup>
                <a
                  href="https://www.cimdata.de/"
                  target="_blank"
                  rel="noreferrer"
                >
                  CIMDATA
                </a>{' '}
                <br />
                {title}
              </Popup>
            </Marker>
          ))}
        </MasterClusterGroup>
      </MapContainer>
    </section>
  );
}

function MapController({ center, zoom }) {
  /* map enthält die Leaflet-Instanz. */
  const map = useMap();

  /* Hier werden Methoden der Leaflet-Bibliothek verwendet, ganz unabhängig
          von React!
          https://leafletjs.com/reference-1.7.1.html#map-methods-for-modifying-map-state
          (Achtung: Da map.setView() das map-Objekt zurückgibt, müssen wir bei der Callback-
          Funktion in useEffect geschweifte Klammern verwenden, um die automatische Rückgabe
          bei einzeiligen Pfeilfunktionen zu vermeiden. React würde sonst map für die
          "Aufräum-Funktion" des Effekts halten und als Funktion aufrufen, was zum Absturz
          des Programms führen würde.)
          */
  useEffect(() => {
    map.setView(center, zoom);
  }, [center, zoom, map]);

  return null;
}

function getUserLocation() {
  // https://developer.mozilla.org/en-US/docs/Web/API/PositionOptions
  const options = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  /* Die ältere geolocation-API basiert auf Callback-Funktionen statt
        Promises. Hier wird sie in ein Promise verpackt, um sie in asynchronen
        Funktionen nutzen zu können. */
  return new Promise((resolve, reject) => {
    window.navigator.geolocation.getCurrentPosition(resolve, reject, options);
  });
}

function getLocationsInRadius(center, radius = 30) {
  const locationsInRadius = cimdataLocations.filter(({ latLng }) => {
    const distance = getDistance(
      latLng.lat,
      latLng.lng,
      center.lat,
      center.lng
    );

    return distance <= radius;
  });

  return locationsInRadius;
}
