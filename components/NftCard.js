import Link from "next/link";
import React from "react";

export default function NftCard({name, description, thumbnail, collectionAddress, nftId}) {
    return (
        <div>
            <p>{name}</p>
            <img src={thumbnail}></img>
            <p>{description}</p>
            <Link href={`/nft/${collectionAddress}/${nftId}`}>
                <a>See more</a>
            </Link>
        </div>
    )
}