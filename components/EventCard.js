import React, {useEffect, useState} from "react";
import Link from "next/link"
import { Box, Image, Badge, Text } from "@chakra-ui/react"
import { queryOgFields } from "../common/interface";

export default function NewsCard({name, from, to, place, description, coverImage, url, tags}) {

    return (
        <div>
            <img src={coverImage} alt={name || "No title"} />
            <p>{name || "No title"}</p>
            <p>{description || "No description"}</p>
            <p>{place}, {from} - {to}</p>
            { url ? <a href={url}>{url}</a> : <></>}
        </div>
    )
}