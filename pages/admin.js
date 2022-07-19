import React, { useEffect, useState } from "react"
import { queryCollections, queryModerators, queryArtists, queryNews, queryEvents } from "../common/interface"
import { useSession } from "next-auth/react"
import { Box, Heading, Button, Input, Text, Flex, Spacer, Textarea, Checkbox } from "@chakra-ui/react"
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
} from '@chakra-ui/react'
import { Tabs, TabList, TabPanels, Tab, TabPanel } from '@chakra-ui/react'
import {
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
} from '@chakra-ui/react'
import Map from "../components/Map"
import PlacePicker from "../components/PlacePicker"
import EventsTab from "../components/EventsTab"

export default function Admin() {
    const [moderators, setModerators] = useState(null)
    const [collections, setCollections] = useState(null)
    const [artists, setArtists] = useState(null)
    const [news, setNews] = useState(null)
    const {data: session} = useSession()

    async function fetchModerators() {
        const newModerators = await queryModerators()
        setModerators(newModerators)
    }

    async function fetchCollections() {
        const newCollections = await queryCollections()
        setCollections(newCollections)
    }

    async function fetchArtists() {
        const newArtists = await queryArtists()
        setArtists(newArtists)
    }

    async function fetchNews() {
        const newNews = await queryNews()
        setNews(newNews)
    }

    async function addModerator(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const moderator = {
            _id: formData.get("address")
        }
        await fetch('/api/moderators/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moderator)
        })
        await fetchModerators()
        e.target.reset()
    }

    async function editModerator(e, _id) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const collection = {
            address: formData.get("address")
        }
        await fetch('/api/moderators/' + _id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        await fetchModerators()
    }

    async function deleteModerator(e, _id) {
        e.preventDefault()
        await fetch('/api/moderators/' + _id, {
            method: 'DELETE'
        })
        await fetchModerators()
    }

    async function addCollection(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const collection = {
            _id: formData.get("address"),
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            platform: formData.get("platform"),
            multiContract: formData.get("multiContract"),
            collectionUrl: formData.get("collectionUrl"),
            nftUrl: formData.get("nftUrl"),
            openseaSlug: formData.get("openseaSlug"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/collections/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        await fetchCollections()
        e.target.reset()
    }

    async function deleteCollection(e, _id) {
        e.preventDefault()
        await fetch('/api/collections/' + _id, {
            method: 'DELETE'
        })
        await fetchCollections()
    }

    async function addArtist(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const artist = {
            address: formData.get("address"),
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/artists/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artist)
        })
        await fetchArtists()
        e.target.reset()
    }

    async function editCollection(e, address) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const collection = {
            address: formData.get("address"),
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            platform: formData.get("platform"),
            multiContract: formData.get("multiContract") === 'on',
            collectionUrl: formData.get("collectionUrl"),
            nftUrl: formData.get("nftUrl"),
            openseaSlug: formData.get("openseaSlug"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/collections/' + address, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        await fetchCollections()
    }

    async function editArtist(e, address) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const artist = {
            address: formData.get("address"),
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/artists/' + address, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artist)
        })
        await fetchArtists()        
    }

    async function deleteArtist(e, _id) {
        e.preventDefault()
        await fetch('/api/artists/' + _id, {
            method: 'DELETE'
        })
        await fetchArtists()
    }

    async function addNews(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const news = {
            // date: formData.get("date"),
            url: formData.get("url"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/news/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(news)
        })
        await fetchNews()
        e.target.reset()
    }

    async function editNews(e, _id) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const collection = {
            // date: formData.get("date"),
            url: formData.get("url"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/news/' + _id, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        await fetchNews()
        e.target.reset()
    }

    async function deleteNews(e, _id) {
        e.preventDefault()
        await fetch('/api/news/' + _id, {
            method: 'DELETE'
        })
        await fetchNews()
    }

    useEffect(() => {
        fetchModerators()
        fetchCollections()
        fetchArtists()
        fetchNews()
    }, [])

    return (
        <Box pt="5em">
            <Heading textAlign="center">Admin page</Heading>
            {
                moderators === null ? (
                    <p>Loading...</p>
                ) : (
                    session?.user ? (
                        moderators.find(x => x.address == session?.address) ? (
                            <Box p="10">
                                <Tabs mt="2" variant='soft-rounded' colorScheme="blue" align="center">
                                    <TabList>
                                        <Tab>Moderators</Tab>
                                        <Tab>Collections</Tab>
                                        <Tab>Artists</Tab>
                                        <Tab>News</Tab>
                                        <Tab>Events</Tab>
                                    </TabList>

                                    <TabPanels>
                                        <TabPanel align="left">
                                            <Heading size="lg">MODERATORS</Heading>
                                            <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                                <form onSubmit={addModerator}>
                                                    <Heading size="md">Add new</Heading>
                                                    <Text>Address</Text>
                                                    <Flex>
                                                        <Input type="text" name="address" placeholder="0x..."/>
                                                        <Button colorScheme="green" type="submit" value="add" w="10em" mx="1em">Add</Button>
                                                    </Flex>
                                                </form>
                                            </Box>
                                            <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                                {moderators.map(moderator => (
                                                    <form key={moderator.address} onSubmit={(e) => editModerator(e, moderator.address)}>
                                                        <Text>Address</Text>
                                                        <Flex>
                                                            <Input mr="1em" defaultValue={moderator.address} name="address" />
                                                            <Button mr="1em" colorScheme="yellow" type="submit">Edit</Button>
                                                            <Button colorScheme="red" onClick={(e) => deleteModerator(e, moderator.address) }>Delete</Button>
                                                        </Flex>
                                                        <Box my="1em" borderWidth="1px"/>
                                                    </form>
                                                    )
                                                )}
                                            </Box>
                                        </TabPanel>
                                        <TabPanel align="left">
                                            <Heading size="lg">COLLECTIONS</Heading>
                                            <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                                <form onSubmit={addCollection}>
                                                    <Heading size="md">Add new collection</Heading>
                                                    <Text mt="2">Address</Text>
                                                    <Input type="text" name="address" placeholder="0x..."/>
                                                    <Text mt="2">Name</Text>
                                                    <Input type="text" name="name" />
                                                    <Text mt="2">Description</Text>
                                                    <Textarea mt="2" type="textarea" name="description"/>
                                                    <Text mt="2">Cover Image: <Input type="text" name="coverImage" placeholder="https://..."/></Text>
                                                    <Text mt="2">Platform: <Input type="text" name="platform"/></Text>
                                                    <Text mt="2">Multicontract: <Checkbox type="checkbox" name="multiContract" /></Text>
                                                    <Text mt="2">Collection URL: <Input type="text" name="collectionUrl" /></Text>
                                                    <Text mt="2">NFT URL: <Input type="text" name="nftUrl"/></Text>
                                                    <Text mt="2">OpenSea slug: <Input type="text" name="openseaSlug"/></Text>
                                                    <Text mt="2">Tags: <Input type="text" name="tags" /></Text>
                                                    <Button mt="2" type="submit" value="Add" colorScheme="green">Add</Button>
                                                </form>
                                            </Box>
                                            <Box p="1em" borderWidth="1px" mt="1em">
                                                <Heading size="md">Added collections</Heading>
                                                <Accordion allowMultiple allowToggle borderWidth="1px">
                                                {
                                                    collections &&
                                                    collections.map(collection => (
                                                        <form onSubmit={e => editCollection(e, collection._id)} key={collection.address}>
                                                            <AccordionItem>
                                                                <h2>
                                                                <AccordionButton>
                                                                    <Box flex='1' textAlign='left'>
                                                                        <Text>Name <Input defaultValue={collection.name} name="name"/></Text>
                                                                    </Box>
                                                                    <AccordionIcon />
                                                                </AccordionButton>
                                                                </h2>
                                                                <AccordionPanel>
                                                                    <Text>Address <Input defaultValue={collection.address} name="address" /></Text>
                                                                    <Text>Description <Input defaultValue={collection.description} name="description"/></Text>
                                                                    <Text>Cover Image <Input defaultValue={collection.coverImage} name="coverImage"/></Text>
                                                                    <Text>Platform <Input defaultValue={collection.platform} name="platform"/></Text>
                                                                    <Text>Multi Contract <Input defaultChecked={collection.multiContract} name="multiContract" type="checkbox"/></Text>
                                                                    <Text>Collection Url <Input defaultValue={collection.collectionUrl} name="collectionUrl"/></Text>
                                                                    <Text>NFT Url <Input defaultValue={collection.nftUrl} name="nftUrl"/></Text>
                                                                    <Text>OpenSea Slug <Input defaultValue={collection.openseaSlug} name="openseaSlug"/></Text>
                                                                    <Text>Tags <Input defaultValue={collection.tags} name="tags"/></Text>
                                                                    <Box mt="2">
                                                                        <Button colorScheme="purple" mr="2" type="reset">Discard Changes</Button>
                                                                        <Button colorScheme="yellow" mr="2" type="submit">Edit</Button>
                                                                        <Button colorScheme="red" onClick={(e) => deleteCollection(e, collection._id)}>Delete</Button>
                                                                    </Box>
                                                                </AccordionPanel>
                                                            </AccordionItem>
                                                        </form>
                                                    ))
                                                }
                                                </Accordion>
                                            </Box>
                                        </TabPanel>
                                        <TabPanel align="left">
                                            <Box>
                                                <Heading size="lg">ARTISTS</Heading>
                                                <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                                    <form onSubmit={addArtist}>
                                                        <Heading size="md">Add new artist</Heading>
                                                        <Text>Address: <Input type="text" name="address" /></Text>
                                                        <Text>Name: <Input type="text" name="name" /></Text>
                                                        <Text>Description: <Input type="textarea" name="description"/></Text>
                                                        <Text>Cover Image: <Input type="text" name="coverImage" /></Text>
                                                        <Text>OpenSea Slug <Input name="openseaSlug"/></Text>
                                                        <Text>Tags <Input name="tags"/></Text>
                                                        <Button mt="2" type="submit" value="Add" colorScheme="green">Add</Button>
                                                    </form>
                                                </Box>
                                                <Box p="1em" borderWidth="1px" mt="1em">
                                                    <Heading size="md">Added artists</Heading>
                                                    <Accordion allowMultiple allowToggle borderWidth="1px">
                                                    {
                                                        artists &&
                                                        artists.map(artist => (
                                                            <form onSubmit={e => editArtist(e, artist.address)} key={artist.address}>
                                                                <AccordionItem>
                                                                    <h2>
                                                                    <AccordionButton>
                                                                        <Box flex='1' textAlign='left'>
                                                                            <Text>Name <Input defaultValue={artist.name} name="name"/></Text>
                                                                        </Box>
                                                                        <AccordionIcon />
                                                                    </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel>
                                                                        <Text>Address <Input defaultValue={artist.address} name="address" /></Text>
                                                                        <Text>Description <Input defaultValue={artist.description} name="description"/></Text>
                                                                        <Text>Cover Image <Input defaultValue={artist.coverImage} name="coverImage"/></Text>
                                                                        <Text>OpenSea Slug <Input defaultValue={artist.openseaSlug} name="openseaSlug"/></Text>
                                                                        <Text>Tags <Input defaultValue={artist.tags} name="tags"/></Text>
                                                                        <Box mt="2">
                                                                            <Button mr="2" colorScheme="purple" type="reset">Discard Changes</Button>
                                                                            <Button mr="2" colorScheme="yellow" type="submit">Edit</Button>
                                                                            <Button mr="2" colorScheme="red" onClick={(e) => deleteArtist(e, artist.address)}>Delete</Button>
                                                                        </Box>
                                                                    </AccordionPanel>
                                                                </AccordionItem>
                                                            </form>
                                                        ))
                                                    }
                                                    </Accordion>
                                                </Box>
                                            </Box>
                                        </TabPanel>
                                        <TabPanel align="left">
                                            <Box>
                                                <Heading size="lg">NEWS</Heading>
                                                <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                                    <form onSubmit={addNews}>
                                                        <Heading size="md">Add new News item</Heading>
                                                        {/* <Text>Date <Input type="datetime-local" name="date" /></Text> */}
                                                        <Text>Url <Input type="text" name="url" /></Text>
                                                        <Text>Tags <Input type="text" name="tags" /></Text>
                                                        <Button mt="2" type="submit" value="Add" colorScheme="green">Add</Button>
                                                    </form>
                                                </Box>
                                                <Box p="1em" borderWidth="1px" mt="1em">
                                                    <Heading size="md">Added events</Heading>
                                                    <Accordion allowMultiple allowToggle borderWidth="1px">
                                                {
                                                    news &&
                                                    news.map(newsItem => (
                                                        <form onSubmit={e => editNews(e, newsItem._id)} key={newsItem._id}>
                                                            <AccordionItem>
                                                                    <h2>
                                                                    <AccordionButton>
                                                                        <Box flex='1' textAlign='left'>
                                                                            <Text>date un nome alle news pls</Text>
                                                                        </Box>
                                                                        <AccordionIcon />
                                                                    </AccordionButton>
                                                                    </h2>
                                                                    <AccordionPanel>
                                                                        {/* <Text>Date <Input defaultValue={newsItem.date} type="date" name="date" /></Text> */}
                                                                        <Text>URL <Input defaultValue={newsItem.url} name="url" /></Text>
                                                                        <Text>Tags <Input defaultValue={newsItem.tags} name="tags"/></Text>
                                                                        <Box mt="2">
                                                                            <Button mr="2" colorScheme="purple" type="reset">Discard Changes</Button>
                                                                            <Button mr="2" colorScheme="yellow" type="submit">Edit</Button>
                                                                            <Button mr="2" colorScheme="red" onClick={(e) => deleteNews(e, newsItem._id)}>Delete</Button>
                                                                        </Box>
                                                                        
                                                                    </AccordionPanel>
                                                            </AccordionItem>
                                                        </form>
                                                    ))
                                                }
                                                    </Accordion>
                                                </Box>
                                            </Box>
                                        </TabPanel>
                                        <TabPanel align="left">
                                            <EventsTab />
                                        </TabPanel>
                                    </TabPanels>
                                </Tabs>
                            </Box>
                        ) : (
                            <p>You are not authorized to view this page.</p>
                        )
                    ) : (
                        <Alert status='warning' m="5" w="auto" height="10em" textAlign="center" alignItems="center" justifyContent="center" flexDirection="column">
                            <AlertIcon boxSize="2em" mb="2"/>
                            <AlertTitle>Sign-In!</AlertTitle>
                            <AlertDescription>You&apos;re not authorized to access this page.</AlertDescription>
                        </Alert>
                    )
                )
            }
        </Box>
    )
}