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

    function handleSubmit(e){
        e.preventDefault()
        const formData = new FormData(e.target)
        const artist = {
            name: formData.get("name"),
            email: formData.get("email"),
            twitter: formData.get("twitter")
        }
        console.log(artist)
        fetch('/api/artists/' + artistAddress, {
            method: 'POST',
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
                                Email
                                <input type="email" name="email"/>
                            </label>
                            <label>
                                Twitter Account
                                <input type="text" name="twitter"/>
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
