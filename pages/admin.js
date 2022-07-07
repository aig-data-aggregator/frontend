import React, { useEffect, useState } from "react"
import { queryModerators } from "../common/interface"
import { useSession } from "next-auth/react"

export default function Admin() {
    const [moderators, setModerators] = useState(null)
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

    useEffect(() => {
        queryModerators().then(newModerators => setModerators(newModerators))
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