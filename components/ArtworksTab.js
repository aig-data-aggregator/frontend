import React, { useEffect, useState } from "react"
import { useReset } from "../common/reset"
import { addressToCollection, queryArtworks } from "../common/interface"
import { Box, Heading, Button, Input, Text, Flex, Spacer, Textarea, Checkbox } from "@chakra-ui/react"
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import ArtworkForm from "./ArtworkForm"

export default function ArtworksTab() {
    const [artworks, setArtworks] = useState(null)

    async function fetchArtworks() {
        const newArtworks = await fetch('/api/artworks/').then(res => res.json())
        for (const artwork of newArtworks) {
            artwork.collectionName = (await addressToCollection(artwork.collectionAddress)).name
        }
        setArtworks(newArtworks)
    }

    async function addArtwork(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const artwork = {
            collectionAddress: formData.get("collectionAddress"),
            tokenId: formData.get("tokenId")
        }
        await fetch('/api/artworks/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artwork)
        })
        await fetchArtworks()
        e.target.reset()
    }

    async function editArtwork(e, _id) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const artwork = {
            collectionAddress: formData.get("collectionAddress"),
            tokenId: formData.get("tokenId")
        }
        await fetch('/api/artworks/' + _id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artwork)
        })
        await fetchArtworks()
        e.target.reset()
        resetAddForm()
    }

    async function deleteArtwork(e, _id) {
        e.preventDefault()
        await fetch('/api/artworks/' + _id, {
            method: 'DELETE'
        })
        await fetchArtworks()
    }

    useEffect(() => {
        fetchArtworks()
    }, [])

    return (
        <Box>
            <Heading size="lg">ARTWORKS</Heading>
            <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                <form onSubmit={addArtwork}>
                    <Heading size="md">Add new artwork</Heading>
                    <ArtworkForm />
                    <Button mt="2" type="submit" value="Add" colorScheme="green">Add</Button>
                </form>
            </Box>
            <Box p="1em" borderWidth="1px" mt="1em">
                <Heading size="md">Added artworks</Heading>
                <Accordion allowMultiple allowToggle borderWidth="1px">
                {
                    artworks &&
                    artworks.map(artwork => (
                        <form onSubmit={e => editArtwork(e, artwork._id)} key={artwork._id}>
                            <AccordionItem>
                                    <h2>
                                    <AccordionButton>
                                        <Box flex='1' textAlign='left'>
                                            <Text>{artwork.collectionName} #{artwork.tokenId}</Text>
                                        </Box>
                                        <AccordionIcon />
                                    </AccordionButton>
                                    </h2>
                                    <AccordionPanel>
                                        <ArtworkForm dataSource={artwork} />
                                        <Box mt="2">
                                            <Button mr="2" colorScheme="purple" type="reset">Discard Changes</Button>
                                            <Button mr="2" colorScheme="yellow" type="submit">Edit</Button>
                                            <Button mr="2" colorScheme="red" onClick={(e) => deleteArtwork(e, dataSource?._id)}>Delete</Button>
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