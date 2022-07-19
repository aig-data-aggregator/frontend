import React, { useEffect, useState } from "react"
import { useReset } from "../common/reset"
import { queryEvents } from "../common/interface"
import { Box, Heading, Button, Input, Text, Flex, Spacer, Textarea, Checkbox } from "@chakra-ui/react"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import Map from "../components/Map"
import PlacePicker from "../components/PlacePicker"
import EventForm from "./EventForm"

export default function EventsTab() {
    const [events, setEvents] = useState(null)
    const [resetAddForm, resetAddFormHandler] = useReset()

    async function fetchEvents() {
        const newEvents = await queryEvents()
        setEvents(newEvents)
    }

    async function addEvent(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const event = {
            name: formData.get("name"),
            description: formData.get("description"),
            place: formData.get("place"),
            latitude: formData.get("latitude"),
            longitude: formData.get("longitude"),
            from: formData.get("from"),
            to: formData.get("to"),
            displayHour: formData.get("displayHour"),
            url: formData.get("url"),
            artists: formData.get("artists").split(',').map(artist => artist.trim()).filter(artist => artist != ""),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/events/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
        await fetchEvents()
        e.target.reset()
        resetAddForm()
    }

    async function editEvent(e, _id) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const event = {
            name: formData.get("name"),
            description: formData.get("description"),
            place: formData.get("place"),
            coordinates: [formData.get("latitude"), formData.get("longitude")],
            from: formData.get("from"),
            to: formData.get("to"),
            displayHour: formData.get("displayHour"),
            url: formData.get("url"),
            artists: formData.get("artists").split(',').map(artist => artist.trim()).filter(artist => artist != ""),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/events/' + _id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(event)
        })
        await fetchEvents()
        e.target.reset()
        resetAddForm()
    }

    async function deleteEvent(e, _id) {
        e.preventDefault()
        await fetch('/api/events/' + _id, {
            method: 'DELETE'
        })
        await fetchEvents()
    }

    useEffect(() => {
        fetchEvents()
    }, [])

    return (
        <Box>
            <Heading size="lg">EVENTS</Heading>
            <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                <form onSubmit={addEvent}>
                    <Heading size="md">Add new event</Heading>
                    <EventForm {...resetAddFormHandler} />
                    <Button mt="2" type="submit" value="Add" colorScheme="green">Add</Button>
                </form>
            </Box>
            <Box p="1em" borderWidth="1px" mt="1em">
                <Heading size="md">Added events</Heading>
                <Accordion allowMultiple allowToggle borderWidth="1px">
                {
                    events &&
                    events.map(event => (
                        <form onSubmit={e => editEvent(e, event._id)} key={event._id}>
                            <AccordionItem>
                                    <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>
                                            <Text>{event.name}</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel>
                                        <EventForm dataSource={event} />
                                        <Box mt="2">
                                            <Button mr="2" colorScheme="purple" type="reset">Discard Changes</Button>
                                            <Button mr="2" colorScheme="yellow" type="submit">Edit</Button>
                                            <Button mr="2" colorScheme="red" onClick={(e) => deleteEvent(e, dataSource?._id)}>Delete</Button>
                                        </Box>
                                    </AccordionPanel>
                            </AccordionItem>
                        </form>
                    ))
                }
                </Accordion>
            </Box>
        </Box>
    )
}