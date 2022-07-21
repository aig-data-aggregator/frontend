import React, { useState } from "react"
import { Input, Text, Textarea } from "@chakra-ui/react"

export default function ArtworkForm({ dataSource }) {
    return (
        <>
            <Text>Collection address <Input type="text" name="collectionAddress" defaultValue={dataSource?.collectionAddress} /></Text>
            <Text>Token ID <Input type="text" name="tokenId" defaultValue={dataSource?.tokenId} /></Text>
        </>
    )
}