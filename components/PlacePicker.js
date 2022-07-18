import { useEffect, useState } from "react";
import { Button, Input, Text } from "@chakra-ui/react";
import Map from "./Map";
import { getCoordinates } from "../common/geo";

export default function PlacePicker({defaultPlace, defaultLatitude, defaultLongitude}) {
    const [place, setPlace] = useState(defaultPlace || null)
    const [latitude, setLatitude] = useState(defaultLatitude || 0)
    const [longitude, setLongitude] = useState(defaultLongitude || 0)
    const [searchResults, setSearchResults] = useState(null)
    const [map, setMap] = useState(null)

    const searchPlace = async () => {
        setSearchResults(await getCoordinates(place))
    }

    const choosePlace = (name, latitude, longitude) => {
        setLatitude(latitude)
        setLongitude(longitude)
    }

    useEffect(() => {
        map?.setView([latitude, longitude], map.getCenter())
    }, [latitude, longitude])

    return (
        <div>
            <Text>Place <Input type="text" value={place} onChange={e => setPlace(e.target.value)} /></Text>
            <Button onClick={searchPlace}>Search</Button>
            {
                searchResults && searchResults.map(res => (
                    <div key={[res.latitude, res.longitude]}>
                        <p>{res.name}</p>
                        <button onClick={() => choosePlace(res.name, res.latitude, res.longitude)}>Choose</button>
                    </div>
                ))
            }
            <Map latitude={latitude} longitude={longitude} ref={map} />
        </div>
    )
}