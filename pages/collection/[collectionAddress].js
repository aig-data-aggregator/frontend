import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';

import { addressToCollections, queryNfts } from '../../common/interface'

export default function CollectionsPage () {
    const [nfts, setNfts] = useState([])
    const [collection, setCollection] = useState({
        name: "",
        description: ""
    })
    const router = useRouter()
    const { collectionAddress } = router.query
    console.log(collectionAddress)

    const fetchNfts = async () => {
        const newNfts = await queryNfts(collectionAddress)

        console.log(newNfts)

        setNfts(newNfts)
        setCollection(await addressToCollections(collectionAddress))
    }
    
    useEffect(() => {
        if (collectionAddress) {
            fetchNfts()
        }
    }, [collectionAddress])
    
    return (
        <div>
            <h1>{collectionAddress || collection.name}</h1>
            <p>{collection.description || 'No description'}</p>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                justifyContent: "space-between",
                margin: "auto",
                alignItems: "center",
            }}>
              {
                  nfts.map(nft => (
                      <NftCard key={nft.tokenId} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={collectionAddress} nftId={nft.tokenId}/>
                  ))
              }
            </div>
        </div>
    )
}