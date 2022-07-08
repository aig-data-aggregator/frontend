import React, { useEffect, useState } from "react"
import { queryCollections, queryModerators, queryArtists } from "../common/interface"
import { useSession } from "next-auth/react"

export default function Admin() {
    const [moderators, setModerators] = useState(null)
    const [collections, setCollections] = useState(null)
    const [artists, setArtists] = useState(null)
    const {data: session} = useSession()

    async function addModerator(e) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const moderator = {
            _id: formData.get("address")
        }
        const response = await fetch('/api/moderators/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(moderator)
        })
        const parsedResponse = await response.json()

        console.log('Response:', parsedResponse)
        if (parsedResponse.upsertedId) {
            setModerators(currentModerators => [...currentModerators, {
                address: parsedResponse.upsertedId
            }])
        }
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
        const response = await fetch('/api/collections/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        const parsedResponse = await response.json()

        console.log('Response:', parsedResponse)
        if (parsedResponse.upsertedId) {
            /*setModerators(currentModerators => [...currentModerators, {
                address: parsedResponse.upsertedId
            }])*/
        }
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
        const response = await fetch('/api/artists/', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artist)
        })
        const parsedResponse = await response.json()

        console.log('Response:', parsedResponse)
        if (parsedResponse.upsertedId) {
            /*setModerators(currentModerators => [...currentModerators, {
                address: parsedResponse.upsertedId
            }])*/
        }
    }

    async function editCollection(e, address) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const collection = {
            address,
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
        console.log(collection)
        const response = await fetch('/api/collections/' + address, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(collection)
        })
        const parsedResponse = await response.json()

        console.log('Response:', parsedResponse)
    }

    async function editArtist(e, address) {
        e.preventDefault()
        const formData = new FormData(e.target)
        const artist = {
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            tags: formData.get("tags").split(',').map(tag => tag.trim())
        }
        console.log(artist)
        const response = await fetch('/api/artists/' + address, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artist)
        })
        const parsedResponse = await response.json()

        console.log('Response:', parsedResponse)
    }

    useEffect(() => {
        queryModerators().then(newModerators => setModerators(newModerators))
        queryCollections().then(newCollections => setCollections(newCollections))
        queryArtists().then(newArtists => setArtists(newArtists))
    }, [])

    return (
        <div>
            <div style={{height: '500px'}}></div>
            <h1>Admin page</h1>
            {
                moderators === null ? (
                    <p>Loading...</p>
                ) : (
                    session?.user ? (
                        moderators.find(x => x.address == session?.address) ? (
                            <div>
                                <p>Current moderators:</p>
                                {moderators.map(moderator => <p key={moderator.address}>{moderator.address}</p>)}
                                <form onSubmit={addModerator}>
                                    <p>Add new</p>
                                    <label>Address: <input type="text" name="address" /></label>
                                    <input type="submit" value="Add"/>
                                </form>
                                <div>
                                    <h3>All collections:</h3>
                                    {
                                        collections &&
                                        collections.map(collection => (
                                            <form onSubmit={e => editCollection(e, collection._id)} key={collection.address}>
                                                <p>{collection.address}</p>
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
                                                <div style={{height:"50px"}}></div>
                                            </form>
                                        ))
                                    }
                                </div>
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
                                            <form onSubmit={e => editArtist(e, artist._id)} key={artist.address}>
                                                <p>{artist.address}</p>
                                                <label>Name <input defaultValue={artist.name} name="name"/></label>
                                                <label>Description <input defaultValue={artist.description} name="description"/></label>
                                                <label>Cover Image <input defaultValue={artist.coverImage} name="coverImage"/></label>
                                                <label>OpenSea Slug <input defaultValue={artist.openseaSlug} name="openseaSlug"/></label>
                                                <label>Tags <input defaultValue={artist.tags} name="tags"/></label>
                                                <button type="reset">Discard Changes</button>
                                                <button type="submit">Edit</button>
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
                            </div>
                        ) : (
                            <p>You are not authorized</p>
                        )
                    ) : (
                        <p>Please Login</p>
                    )
                )
            }
        </div>
    )
}