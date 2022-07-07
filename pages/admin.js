import React, { useEffect, useState } from "react"
import { queryCollections, queryModerators } from "../common/interface"
import { useSession } from "next-auth/react"

export default function Admin() {
    const [moderators, setModerators] = useState(null)
    const [collections, setCollections] = useState(null)
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

    useEffect(() => {
        queryModerators().then(newModerators => setModerators(newModerators))
        queryCollections().then(newCollections => setCollections(newCollections))
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
                                {moderators.map(moderator => <p>{moderator.address}</p>)}
                                <form onSubmit={addModerator}>
                                    <p>Add new</p>
                                    <label>Address: <input type="text" name="address" /></label>
                                    <input type="submit" value="Add"/>
                                </form>
                                <p>Collections:</p>
                                {collections.map(collection => <p>{collection.name}</p>)}
                                <form onSubmit={addCollection}>
                                    <p>Add new</p>
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