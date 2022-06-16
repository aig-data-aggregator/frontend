import React from "react";
import Link from "next/link"

export default function CollectionCard({name, coverUrl, description, address}) {
    return (
        <div style={{
            boxShadow: "0 4px 8px 0 rgba(0,0,0,0.2)",
            transition: "0.3s",
            width: "auto",
            padding: "1em"
        }}>
            <img src= {coverUrl} alt="Collection's Cover image"></img>
            <div style={{
                padding: "2px 16px"
            }}>
                <h4><b>{name}</b></h4>
                <p>Description: {description}</p>
                <Link href={`/collection/${address}`}>
                    <a style={{
                        color: "red",
                        textDecoration: "underline"
                    }}>See more</a>
                </Link>
            </div>
        </div>
    )
}