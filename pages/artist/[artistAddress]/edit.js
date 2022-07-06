import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"

export default function EditArtistPage(){
    const router = useRouter()
    const { artistAddress } = router.query
    return (
        <div>
            <h1>Edit Artist</h1>
            <p>{artistAddress}</p>
        </div>
    )
}
