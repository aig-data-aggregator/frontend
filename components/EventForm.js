import React, { useState } from "react"
import { Box, Button, Input, Text, Textarea, Checkbox } from "@chakra-ui/react"
import PlacePicker from "../components/PlacePicker"

export default function EventForm({ dataSource }) {
    const [displayHour, setDisplayHour] = useState(dataSource?.displayHour)
    const [artistsField, setArtistsField] = useState(dataSource?.artists)
    const [artistSearch, setArtistSearch] = useState(null)
    const [artistSuggestions, setArtistSuggestions] = useState(null)

    const search = (e) => {
        e.preventDefault()
        if (!artistSearch) {
            return
        }

        fetch('/api/artists?search=' + encodeURI(artistSearch))
            .then(res => res.json())
            .then(suggestions => setArtistSuggestions(suggestions))
    }

    const add = (e, suggestion) => {
        e.preventDefault()
        setArtistsField(current => (current ? current + ', ' : '') + suggestion.address)
        setArtistSearch(null)
        setArtistSuggestions(null)
    }

    return (
        <>
            <Text>Name <Input type="text" name="name" defaultValue={dataSource?.name} /></Text>
            <Text>Description <Textarea type="text" name="description" defaultValue={dataSource?.description} /></Text>
            <Text>Cover image <Input type="text" name="coverImage" defaultValue={dataSource?.coverImage} /></Text>
            <PlacePicker defaultPlace={dataSource?.place} defaultLatitude={dataSource?.latitude} defaultLongitude={dataSource?.longitude} />
            <Text>Display hour: <Checkbox type="checkbox" name="displayHour" checked={displayHour} onChange={e => setDisplayHour(e.target.checked)} /></Text>
            <Text>From <Input type={displayHour ? "datetime-local" : "date"} name="from" defaultValue={dataSource?.from} /></Text>
            <Text>To <Input type={displayHour ? "datetime-local" : "date"} name="to" defaultValue={dataSource?.to} /></Text>
            <Text>Url <Input type="text" name="url" defaultValue={dataSource?.url} /></Text>
            <Text>Artist addresses (comma-separated) <Input type="text" name="artists" value={artistsField} onChange={e => setArtistsField(e.target.value)} /></Text>
            <div>
                <p>Search Artist</p>
                <Input type="text" name="artistSearch" key={artistSearch === null} value={artistSearch} onChange={e => setArtistSearch(e.target.value)} />
                <button onClick={search}>Search</button>
                {
                    artistSuggestions && artistSuggestions.map(
                        suggestion => <div>
                            <p>{suggestion.name} {suggestion.address}</p>
                            <button onClick={e => add(e, suggestion)}>Choose</button>
                        </div>
                    )
                }
            </div>
            <Text>Tags <Input type="text" name="tags" defaultValue={dataSource?.tags} /></Text>
        </>
    )
}