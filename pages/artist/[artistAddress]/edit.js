import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { useSession } from "next-auth/react";
import { queryModerators, querySingleArtist } from "../../../common/interface";

export default function EditArtistPage(){
    const router = useRouter()
    const { artistAddress } = router.query
    const {data: session} = useSession()
    const [moderators, setModerators] = useState([])
    const isLoggedIn = session?.user
    const isAuthorized = isLoggedIn && (session.address === artistAddress || moderators.find(x => x.address === session.address))

    useEffect(() => {
        queryModerators().then(newModerators => setModerators(newModerators))
    }, [])

    async function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(e.target)
        const artist = {
            address: artistAddress,
            name: formData.get("name"),
            description: formData.get("description"),
            coverImage: formData.get("coverImage"),
            tags: formData.get("tags").split(',').map(tag => tag.trim()).filter(tag => tag != "")
        }
        await fetch('/api/artists/' + artistAddress, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(artist)
        })
    }

    return (
        <div>
            <div style={{height:"400px"}}></div>
            {isLoggedIn ?
            (
                isAuthorized ? (
                    <div>
                        <h1>Edit Artist</h1>
                        <p>{artistAddress}</p>
                        <form onSubmit={handleSubmit}>
                            <label>
                                Name
                                <input type="text" name="name"/>
                            </label>
                            <label>
                                Cover image
                                <input type="text" name="coverImage"/>
                            </label>
                            <label>
                                Description
                                <input type="text" name="description"/>
                            </label>
                            <label>
                                OpenSea slug
                                <input type="text" name="openseaSlug"/>
                            </label>
                            <label>
                                Tags
                                <input type="text" name="tags"/>
                            </label>
                            <input type="submit" value="Submit" />
                        </form>
                    </div>
                ) : <p>You are not authorized to edit this artist's page</p>
            ) 
            
            :
            <p>Please Log In</p>
            }
        </div>
    )
}
