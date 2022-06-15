import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";

const networkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = "https://api.zora.co/graphql";
const args = { 
              endPoint:API_ENDPOINT, 
              networks:[networkInfo], 
              apiKey: process.env.API_KEY 
            } 

const zdk = new ZDK(args)

export default function NftPage () {
    const router = useRouter()
    const { collectionAddress, nftId } = router.query
    const [nftInfo, setNftInfo] = useState({
        name: "",
        description: "",
        url: ""
    })

    const queryNft = async () => {
        const newNftInfo = await zdk.token({
            token: {
                address: collectionAddress,
                tokenId: nftId
            }
        })
        console.log(newNftInfo)
        setNftInfo({
            name: newNftInfo.token.token.name,
            description: newNftInfo.token.token.description,
            url: newNftInfo.token.token.image.mediaEncoding.poster
        })
    }

    useEffect(() => {
        if (nftId && collectionAddress) {
            queryNft()
        }       
    }, [nftId, collectionAddress])

    return (
        <div>
            <h1>{nftInfo.name}</h1>
            <img src={nftInfo.url} />
            <p>{nftInfo.description}</p>
        </div>
    )
}