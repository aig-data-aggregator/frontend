import React, { useState } from "react"
import { Box, Button, Input, Text, Textarea, Checkbox } from "@chakra-ui/react"
import PlacePicker from "../components/PlacePicker"

export default function EventForm({ dataSource }) {
    const [displayHour, setDisplayHour] = useState(dataSource?.displayHour)
    return (
        <>
            <Text>Name <Input type="text" name="name" defaultValue={dataSource?.name} /></Text>
            <Text>Description <Textarea type="text" name="description" defaultValue={dataSource?.description} /></Text>
            <PlacePicker defaultPlace={dataSource?.place} defaultLatitude={dataSource?.latitude} defaultLongitude={dataSource?.longitude} />
            <Text>Display hour: <Checkbox type="checkbox" name="displayHour" checked={displayHour} onChange={e => setDisplayHour(e.target.checked)} /></Text>
            <Text>From <Input type={displayHour ? "datetime-local" : "date"} name="from" defaultValue={dataSource?.from} /></Text>
            <Text>To <Input type={displayHour ? "datetime-local" : "date"} name="to" defaultValue={dataSource?.to} /></Text>
            <Text>Url <Input type="text" name="url" defaultValue={dataSource?.url} /></Text>
            <Text>Artists <Input type="text" name="artists" defaultValue={dataSource?.artists} /></Text>
            <Text>Tags <Input type="text" name="tags" defaultValue={dataSource?.tags} /></Text>
            
        </>
    )
}