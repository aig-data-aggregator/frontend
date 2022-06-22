import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { addressToCollections, queryNftInfo } from '../../../common/interface.js'

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
        url: "",
        sales: []
    })
    const [collectionInfo, setCollectionInfo] = useState(null)

    const queryNft = async () => {
        const nft =  await queryNftInfo(collectionAddress, nftId)
        setNftInfo(nft)
    }

    const queryCollection = async () => {
        const collection = await addressToCollections(collectionAddress)
        setCollectionInfo(collection)
    }

    useEffect(() => {
        if (collectionAddress) {
            if (nftId || nftId === 0) {
                queryNft()
            }
            queryCollection()
        }       
    }, [nftId, collectionAddress])

    return (
        <div>
            <h1>Name: {nftInfo.name}</h1>
            <img src={nftInfo.url} />
            <p>Description: {nftInfo.description}</p>
            { collectionInfo && collectionInfo.nftUrl ? <a href={collectionInfo.nftUrl.replace('{id}', nftId)} target="_blank" rel="noopener noreferrer">View on {collectionInfo.platform}</a> : <></> }
            <p><a href={`https://etherscan.io/address/${nftInfo.owner}`} target="_blank" rel="noopener noreferrer">Owner: {nftInfo.owner}</a></p>
            <p><a href={`https://etherscan.io/address/${nftInfo.minter}`} target="_blank" rel="noopener noreferrer">Minter: {nftInfo.minter}</a></p>
            <h2>Sales:</h2>
            {
                nftInfo.sales.map(sale => (
                    <div key={sale.hash}>
                        <p>{sale.timestamp}</p>
                        <p>From {sale.seller} to {sale.buyer}</p>
                        <p>Price: {sale.nativePrice.amount} {sale.nativePrice.currency} ({sale.usdPrice} USD)</p>
                        <a href={`https://etherscan.io/tx/${sale.hash}`} target="_blank" rel="noopener noreferrer">View on Etherscan</a>

                    </div>
                ))
            }
        </div>
    )
}