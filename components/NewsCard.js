import React, {useEffect, useState} from "react";
import Link from "next/link"
import { Box, Image, Badge, Text } from "@chakra-ui/react"
import { queryOgFields } from "../common/interface";

export default function NewsCard({date, url, tags}) {
    const [fields, setFields] = useState(null)

    useEffect(() => {
        queryOgFields(url).then(newFields => setFields(newFields))        
    }, [url])

    return (
        <div>
            <p>{fields?.title || "No title"}</p>
            <p>{fields?.description || "No description"}</p>
            <img src={fields?.imageUrl} alt="No image" />
        </div>
    )
}