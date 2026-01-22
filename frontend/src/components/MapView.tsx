import { MapContainer, TileLayer, Polyline, Marker } from "react-leaflet";
import type { LatLngExpression } from "leaflet";

type Props = {
    coordinates: [number, number][];
};

function MapView({ coordinates }: Props) {
    // Safety check: do not render map if no coordinates
    if (!coordinates || coordinates.length === 0) {
        return null;
    }

    const polyline: LatLngExpression[] = coordinates.map(
        ([lng, lat]) => [lat, lng]
    );

    const center: LatLngExpression = polyline[0];

    return (
        <MapContainer
            center={center}
            zoom={5}
            style={{ height: "400px", width: "100%", marginTop: "20px" }}
        >
            <TileLayer
                attribution="© OpenStreetMap contributors"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            <Polyline positions={polyline} />
            <Marker position={polyline[0]} />
            <Marker position={polyline[polyline.length - 1]} />
        </MapContainer>
    );
}

export default MapView;
