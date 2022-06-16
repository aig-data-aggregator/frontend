import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { queryNftInfo } from '../../../common/interface.js'

// const networkInfo = {
//     network: ZDKNetwork.Ethereum,
//     chain: ZDKChain.Mainnet,
// }

// const API_ENDPOINT = "https://api.zora.co/graphql";
// const args = { 
//               endPoint:API_ENDPOINT, 
//               networks:[networkInfo], 
//               apiKey: process.env.API_KEY 
//             } 

// const zdk = new ZDK(args)

export default function NftPage () {
    const router = useRouter()
    const { collectionAddress, nftId } = router.query
    const [nftInfo, setNftInfo] = useState({
        name: "",
        description: "",
        url: ""
    })

    const queryNft = async () => {
        const nft =  await queryNftInfo(collectionAddress, nftId)
        console.log(nft)
        setNftInfo(nft)
    }

    useEffect(() => {
        if (nftId && collectionAddress) {
            queryNft()
        }       
    }, [nftId, collectionAddress])

    return (
        <div>
            <h1>Name: {nftInfo.name}</h1>
            <img src={nftInfo.url} />
            <p>Description: {nftInfo.description}</p>
        </div>
    )
}