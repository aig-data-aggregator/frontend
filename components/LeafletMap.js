import 'leaflet/dist/leaflet.css';
import { Map, MapContainer, Marker, TileLayer } from "react-leaflet";
import React from 'react';
import {Icon} from 'leaflet'
export default function LeafletMap({latitude, longitude}) {
    /*React.useEffect(() => {
        const L = require("leaflet");
    
        delete L.Icon.Default.prototype._getIconUrl;
    
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
          iconUrl: require("leaflet/dist/images/marker-icon.png"),
          shadowUrl: require("leaflet/dist/images/marker-shadow.png")
        });
      }, []);*/
    // The "key" prop forces a re-render whenever the main position is updated
    return (
        <div style={{width: "500px", height: "500px"}}>
            <MapContainer
                center={[latitude || 0, longitude || 0]}
                zoom={13} style={{width:"100%", height: "100%"}}
                scrollWheelZoom={false}
                key={[latitude || 0, longitude || 0]}>
                    
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <Marker position={{lat: latitude || 0, lng: longitude || 0}} icon={new Icon({iconUrl: "/marker-icon.png", iconSize: [25, 41], iconAnchor: [12, 41]})} />
            </MapContainer>
        </div>
    )
}