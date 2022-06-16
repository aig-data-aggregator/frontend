import Link from "next/link";
import React from "react";

export default function NftCard({name, description, thumbnail, collectionAddress, nftId}) {
    return (
        <div style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            transition: "0.3s",
            width: "auto"
        }}>
            <img src= {thumbnail} alt="Nft"></img>
            <div style={{
                padding: "2px 16px"
            }}>
                <h4><b>{name}</b></h4>
                <p>Description: {description}</p>
                <Link href={`/nft/${collectionAddress}/${nftId}`}>
                    <a style={{
                        color: "red",
                        textDecoration: "underline"
                    }}>See more</a>
                </Link>
            </div>
        </div>
    )
}