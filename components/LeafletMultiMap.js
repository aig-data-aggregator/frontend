import 'leaflet/dist/leaflet.css';
import { Map, MapContainer, Marker, TileLayer, Tooltip } from "react-leaflet";
import React from 'react';
import {Icon} from 'leaflet'
export default function LeafletMultiMap({ markers, onClick }) {
    // The "key" prop forces a re-render whenever the main position is updated
    return (
        <div style={{width: "500px", height: "500px"}}>
            <MapContainer
                center={[0, 0]}
                zoom={1} style={{width:"100%", height: "100%"}}
                scrollWheelZoom={false}
                key={markers}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                {markers.map(
                    marker =>
                    <Marker
                        position={{lat: marker.latitude, lng: marker.longitude}}
                        eventHandlers={{
                            click: (e) => {
                              onClick(marker)
                            }
                        }}
                        icon={new Icon({iconUrl: "/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41]})}>
                            <Tooltip direction="right" offset={[0, 0]} opacity={1} permanent>{marker.name}</Tooltip>
                    </Marker>
                )}
                
            </MapContainer>
        </div>
    )
}