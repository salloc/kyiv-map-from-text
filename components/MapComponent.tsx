import React from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import type { MarkerData, UserLocation } from '../types';
import { MarkerType } from '../types';

// Programmatically create SVG icons for map markers to avoid external files
const createMarkerIcon = (color: string) => {
    return L.divIcon({
        html: `<svg viewBox="0 0 24 24" width="32" height="32" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 2px rgba(0, 0, 0, 0.5));"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}" stroke="#fff" stroke-width="0.5"/></svg>`,
        className: 'bg-transparent border-0',
        iconSize: [32, 32],
        iconAnchor: [16, 32], // Point of the icon which will correspond to marker's location
        popupAnchor: [0, -32], // Point from which the popup should open relative to the iconAnchor
    });
};

const icons = {
    [MarkerType.Activity]: createMarkerIcon('#ef4444'), // Tailwind red-500
    [MarkerType.Warning]: createMarkerIcon('#f59e0b'), // Tailwind amber-500
    [MarkerType.User]: createMarkerIcon('#3b82f6'), // Tailwind blue-500
};

// A helper component to programmatically change map view
const ChangeView: React.FC<{ center: [number, number]; zoom: number }> = ({ center, zoom }) => {
    const map = useMap();
    map.flyTo(center, zoom);
    return null;
};

interface MapComponentProps {
    markers: MarkerData[];
    userLocation: UserLocation | null;
}

const MapComponent: React.FC<MapComponentProps> = ({ markers, userLocation }) => {
    const kyivCenter: [number, number] = [50.4501, 30.5234];
    
    // Determine the map's center and zoom level
    const getMapView = () => {
        if (userLocation) {
            return { center: [userLocation.latitude, userLocation.longitude] as [number, number], zoom: 14 };
        }
        if (markers.length === 1) {
            return { center: [markers[0].latitude, markers[0].longitude] as [number, number], zoom: 14 };
        }
        // If multiple markers, don't change view, let user explore
        return { center: kyivCenter, zoom: 11 };
    };
    
    const { center, zoom } = getMapView();

    return (
        <MapContainer center={kyivCenter} zoom={11} scrollWheelZoom={true}>
            <ChangeView center={center} zoom={zoom} />
            <TileLayer
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
            />
            {markers.map((marker) => (
                <Marker key={marker.id} position={[marker.latitude, marker.longitude]} icon={icons[marker.type]}>
                    <Popup>
                        <div className="text-gray-800">
                            <strong className="block text-lg">{marker.locationName}</strong>
                            <p className="my-1 text-base italic">"{marker.originalText}"</p>
                            {marker.time && <p className="text-sm text-gray-600">Час: {marker.time}</p>}
                            <p className="text-sm capitalize">Тип: {marker.type === MarkerType.Activity ? 'Активність' : 'Попередження'}</p>
                        </div>
                    </Popup>
                </Marker>
            ))}
            {userLocation && (
                <Marker position={[userLocation.latitude, userLocation.longitude]} icon={icons[MarkerType.User]}>
                    <Popup>
                        <span className="text-base">Ваше місцезнаходження</span>
                    </Popup>
                </Marker>
            )}
        </MapContainer>
    );
};

export default MapComponent;