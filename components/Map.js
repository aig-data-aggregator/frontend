import dynamic from 'next/dynamic'
import { useMemo } from 'react';

/*export default function Map() {
  const LeafletMap = dynamic(
    () => import('./Header.js'),//import('./LeafletMap.js'), // replace '@components/map' with your component's location
    { ssr: false, loading: <p>Loading...</p> } // This line is important. It's what prevents server-side render
  )
  return Object.keys(<LeafletMap />)
}*/

import { MapContainer, Marker } from "react-leaflet-universal";
//import { Map } from 'react-leaflet-universal';

export default function Map(props) {
    const MapWithNoSSR = useMemo(() => dynamic(() => import("./LeafletMap"), {
        ssr: false
      }), []);
    return (
        MapWithNoSSR ? (
            <MapWithNoSSR {...props} />
        ) : <p>No map available</p>
    )
}