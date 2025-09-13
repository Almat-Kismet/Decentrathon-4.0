
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap, ScaleControl } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Решение проблемы с иконками Leaflet в сборщиках (webpack/vite)
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const ALMATY_CENTER = [43.2220, 76.8512];

function RecenterMap({ center }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    map.setView(center, map.getZoom(), { animate: true });
  }, [center, map]);
  return null;
}

const DriverMap = ({ initialCenter = ALMATY_CENTER, initialZoom = 13 }) => {
  const [position, setPosition] = useState(initialCenter);
  const [zoom] = useState(initialZoom);

  const handleLocate = () => {
    if (!navigator.geolocation) {
      alert('Geolocation не поддерживается в этом браузере');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition([latitude, longitude]);
      },
      (err) => {
        console.error('Geolocation error:', err);
        alert('Не удалось получить позицию — разреши доступ к геолокации');
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 10000 }
    );
  };

  return (
    <div style={{ height: '100vh', display: 'flex', flexDirection: 'column', alignContent:'center' }}>
      <div style={{ flex: 1}}>
        <MapContainer center={position} zoom={zoom} style={{ height: '100%' }} scrollWheelZoom={true}>
          <TileLayer
            attribution='&copy; OpenStreetMap contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          {/* Маркер текущей позиции водителя */}
          <Marker position={position}>
            <Popup>Вы здесь</Popup>
          </Marker>

          <RecenterMap center={position} />

          <ScaleControl position="bottomleft" />
        </MapContainer>
      </div>

      {/* Небольшая нижняя панель с кнопкой для локейта и показом координат */}
      <div style={{ padding: 10, borderTop: '1px solid #e6e6e6', background: '#fff', display: 'flex', alignItems: 'center' }}>
        <button
          onClick={handleLocate}
          style={{ padding: '8px 12px', borderRadius: 6, border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Определить мою позицию
        </button>

        <div style={{ marginLeft: 12, fontSize: 14 }}>
          Центр карты: {position[0].toFixed(5)}, {position[1].toFixed(5)}
        </div>

        <div style={{ marginLeft: 'auto', fontSize: 13, color: '#666' }}>
          Zoom: {zoom}
        </div>
      </div>
    </div>
  );
}

export default DriverMap;