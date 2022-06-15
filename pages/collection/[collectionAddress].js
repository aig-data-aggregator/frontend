import React, { useEffect } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';
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

export default function CollectionsPage () {
    const [nfts, setNfts] = React.useState([])
    const router = useRouter()
    const { collectionAddress } = router.query
    console.log(collectionAddress)

    const queryNfts = async () => {
        const newNfts = await zdk.tokens({
          where: {
            collectionAddresses: [collectionAddress]
          },
          pagination: {
            limit: 100
          },
          nodes: {
            image: {
              url: true
            }
          }
        })

        console.log(newNfts)

        setNfts(newNfts.tokens.nodes.map(
            nft => ({
                thumbnail: nft.token.image.mediaEncoding.thumbnail,
                name: nft.token.name,
                tokenId: nft.token.tokenId
            })
        ))
    }
    
    useEffect(() => {
        if (collectionAddress) {
            queryNfts()
        }
    }, [collectionAddress])
    
    return (
        <div>
            <h1>{collectionAddress}</h1>
            {
                nfts.map(nft => (
                    <NftCard key={nft.id} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={collectionAddress} nftId={nft.tokenId}/>
                ))
            }
        </div>
    )
}