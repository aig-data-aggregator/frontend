import dynamic from 'next/dynamic'
import { useMemo } from 'react';

export default function MultiMap(props) {
    const MapWithNoSSR = useMemo(() => dynamic(() => import("./LeafletMultiMap"), {
        ssr: false
      }), []);
    return (
        MapWithNoSSR ? (
            <MapWithNoSSR {...props} />
        ) : <p>No map available</p>
    )
}