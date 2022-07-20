import React, {useState, useEffect } from "react"
import { queryEvents } from "../common/interface"
import EventCard from "../components/EventCard"
import MultiMap from "../components/MultiMap"

export default function Event() {
    const [events, setEvents] = useState(null)

    useEffect(() => {
        queryEvents().then(newEvents => setEvents(newEvents.sort((a, b) => b.from - a.from)))
    }, [])

    return (
        <div>
            <div style={{height: "300px"}}/>
            {events && <MultiMap markers={events} onClick={marker => console.log(marker)} />}
            {events && events.map(event => (
                <EventCard key={event.name} name={event.name} description={event.description} coverImage={event.coverImage} from={event.from} to={event.to} place={event.place} tags={event.tags} />    
            ))}
        </div>
    )
}