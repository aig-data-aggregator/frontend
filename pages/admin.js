import React, { useEffect, useState } from "react"
import { queryCollections, queryModerators, queryArtists, queryNews } from "../common/interface"
import { useSession } from "next-auth/react"
import { Box, Heading, Button, Input, Text, Flex, Spacer } from "@chakra-ui/react"
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
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
            date: formData.get("date"),
            url: formData.get("url"),
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
            date: formData.get("date"),
            url: formData.get("url"),
            tags: formData.get("tags").split(',').map(tag => tag.trim())
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
                                <Heading size="lg">MODERATORS</Heading>
                                <Box borderWidth='1px' borderRadius='lg' p="1em">
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
                                <Box borderWidth='1px' borderRadius='lg' p="1em" mt="1em">
                                    <form onSubmit={addModerator}>
                                        <Heading size="md">Add new</Heading>
                                        <Text>Address</Text>
                                        <Flex>
                                            <Input type="text" name="address" />
                                            <Button colorScheme="green" type="submit" value="add" w="10em" mx="1em">Add</Button>
                                        </Flex>
                                    </form>
                                </Box>
                                <Box mt="1em">
                                    <Heading size="lg">COLLECTIONS</Heading>
                                    {
                                        collections &&
                                        collections.map(collection => (
                                            <form onSubmit={e => editCollection(e, collection._id)} key={collection.address}>
                                                <label>Address <input defaultValue={collection.address} name="address" /></label>
                                                <label>Name <input defaultValue={collection.name} name="name"/></label>
                                                <label>Description <input defaultValue={collection.description} name="description"/></label>
                                                <label>Cover Image <input defaultValue={collection.coverImage} name="coverImage"/></label>
                                                <label>Platform <input defaultValue={collection.platform} name="platform"/></label>
                                                <label>Multi Contract <input defaultChecked={collection.multiContract} name="multiContract" type="checkbox"/></label>
                                                <label>Collection Url <input defaultValue={collection.collectionUrl} name="collectionUrl"/></label>
                                                <label>NFT Url <input defaultValue={collection.nftUrl} name="nftUrl"/></label>
                                                <label>OpenSea Slug <input defaultValue={collection.openseaSlug} name="openseaSlug"/></label>
                                                <label>Tags <input defaultValue={collection.tags} name="tags"/></label>
                                                <button type="reset">Discard Changes</button>
                                                <button type="submit">Edit</button>
                                                <button onClick={(e) => deleteCollection(e, collection._id)}>Delete</button>
                                                <div style={{height:"50px"}}></div>
                                            </form>
                                        ))
                                    }
                                </Box>
                                <form onSubmit={addCollection}>
                                    <h3>Add new collection</h3>
                                    <label>Address: <input type="text" name="address" /></label>
                                    <label>Name: <input type="text" name="name" /></label>
                                    <label>Description: <input type="textarea" name="description"/></label>
                                    <label>Cover Image: <input type="text" name="coverImage" /></label>
                                    <label>Platform: <input type="text" name="platform"/></label>
                                    <label>Multicontract: <input type="checkbox" name="multiContract" /></label>
                                    <label>Collection URL: <input type="text" name="collectionUrl" /></label>
                                    <label>NFT URL: <input type="text" name="nftUrl"/></label>
                                    <label>OpenSea slug: <input type="text" name="openseaSlug"/></label>
                                    <label>Tags: <input type="text" name="tags" /></label>
                                    <input type="submit" value="Add"/>
                                </form>
                                <div>
                                    <h3>All artists:</h3>
                                    {
                                        artists &&
                                        artists.map(artist => (
                                            <form onSubmit={e => editArtist(e, artist.address)} key={artist.address}>
                                                <label>Address <input defaultValue={artist.address} name="address" /></label>
                                                <label>Name <input defaultValue={artist.name} name="name"/></label>
                                                <label>Description <input defaultValue={artist.description} name="description"/></label>
                                                <label>Cover Image <input defaultValue={artist.coverImage} name="coverImage"/></label>
                                                <label>OpenSea Slug <input defaultValue={artist.openseaSlug} name="openseaSlug"/></label>
                                                <label>Tags <input defaultValue={artist.tags} name="tags"/></label>
                                                <button type="reset">Discard Changes</button>
                                                <button type="submit">Edit</button>
                                                <button onClick={(e) => deleteArtist(e, artist.address)}>Delete</button>
                                                <div style={{height:"50px"}}></div>
                                            </form>
                                        ))
                                    }
                                </div>
                                <form onSubmit={addArtist}>
                                    <h3>Add new artist</h3>
                                    <label>Address: <input type="text" name="address" /></label>
                                    <label>Name: <input type="text" name="name" /></label>
                                    <label>Description: <input type="textarea" name="description"/></label>
                                    <label>Cover Image: <input type="text" name="coverImage" /></label>
                                    <label>OpenSea Slug <input name="openseaSlug"/></label>
                                    <label>Tags <input name="tags"/></label>
                                    <input type="submit" value="Add"/>
                                </form>

                                <div>
                                    <h3>All news:</h3>
                                    {
                                        news &&
                                        news.map(newsItem => (
                                            <form onSubmit={e => editNews(e, newsItem._id)} key={newsItem._id}>
                                                <label>Date <input defaultValue={newsItem.date} type="date" name="date" /></label>
                                                <label>URL <input defaultValue={newsItem.url} name="url" /></label>
                                                <label>Tags <input defaultValue={newsItem.tags} name="tags"/></label>
                                                <button type="reset">Discard Changes</button>
                                                <button type="submit">Edit</button>
                                                <button onClick={(e) => deleteNews(e, newsItem._id)}>Delete</button>
                                                <div style={{height:"50px"}}></div>
                                            </form>
                                        ))
                                    }
                                </div>
                                <form onSubmit={addNews}>
                                    <h3>Add new News item</h3>
                                    <label>Date: <input type="date" name="date" /></label>
                                    <label>Url: <input type="text" name="url" /></label>
                                    <label>Tags: <input type="text" name="tags" /></label>
                                    <input type="submit" value="Add"/>
                                </form>
                            </Box>
                        ) : (
                            <p>You are not authorized</p>
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