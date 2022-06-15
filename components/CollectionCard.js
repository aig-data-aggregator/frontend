import React from "react";
import Link from "next/link"

export default function CollectionCard({name, coverUrl, description, address}) {
    return (
        <div>
            <img src={coverUrl}></img>
            <p>{name}</p>
            <p>{description}</p>
            <Link href={`/collection/${address}`}>
                <a>See more</a>
            </Link>
        </div>
    )
}