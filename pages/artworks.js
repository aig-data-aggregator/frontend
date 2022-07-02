import Head from 'next/head'
import React, {useEffect, useState} from 'react'
import {queryFeatured, queryNftInfo} from '../common/interface'
import { Flex, Box } from '@chakra-ui/react';
import NftCard from '../components/NftCard';


export default function Artworks() {
    const [featured, setFeatured] = useState([])
    const [nftInfos, setNftInfos] = useState({})

    const fetchFeatured = async () => {
        const newFeatured = await queryFeatured();
        setFeatured(newFeatured);

        for (const nft of newFeatured) {
            queryNftInfo(nft.collectionAddress, nft.tokenId).then (info => {
                setNftInfos(currentInfos => {
                    const updatedInfos = {...currentInfos}
                    updatedInfos[[nft.collectionAddress, nft.tokenId]] = info
                    console.log('Done!')
                    console.log(updatedInfos)
                    return updatedInfos
                })
            })
        }
    }

    const getInfo = (collectionAddress, tokenId) => {
        return nftInfos[[collectionAddress, tokenId]] || {}
    }

    useEffect(() => {
        fetchFeatured()
    }, [])

    return (
        <div>
            <Head>
                <title>AIG Data</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <h1>Featured NFTs</h1>
            <Flex m="1em" wrap="wrap" justify="space-around" align="center" pt="3em">
            {
                    featured.map((nft) => ({...nft, ...getInfo(nft.collectionAddress, nft.tokenId)})).map(
                        nftInfo => 
                        <Box my="1em" key={nftInfo.address}>
                            <NftCard key={nftInfo.address} name={nftInfo.name} description={nftInfo.description} collectionAddress={nftInfo.collectionAddress} nftId={nftInfo.tokenId} thumbnail={nftInfo.url}/>
                        </Box>
                    )
                }
            </Flex>
        </div>
    )
}