import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';

import { addressToCollections, queryNfts } from '../../common/interface'
import { Box, Button, Image, Heading, Flex } from "@chakra-ui/react";
import {
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup,
} from '@chakra-ui/react'

export default function CollectionsPage () {
    const [pageIndex, setPageIndex] = useState(0)
    const [allPages, setAllPages] = useState([])
    const [nfts, setNfts] = useState([])
    const [loadingPage, setLoadingPage] = useState(false)

    const [collection, setCollection] = useState({
        name: "",
        description: ""
    })
    const router = useRouter()
    const { collectionAddress } = router.query

    const fetchNfts = async () => {
        // first fetch
        const newNfts = await queryNfts(collectionAddress)
        setAllPages([{
            nfts: newNfts.nfts,
            nextPage: newNfts.nextPage,
            hasNextPage: newNfts.hasNextPage
        }])
        // console.log("new Pages: ", allPages)
        setNfts(newNfts.nfts)
        setPageIndex(0)
        setCollection(await addressToCollections(collectionAddress))
    }
    
    useEffect(() => {
        if (collectionAddress) {
            fetchNfts()
        }
    }, [collectionAddress])
    
    async function fetchNextPage(){
        const newPageIndex = pageIndex + 1
        if(allPages[pageIndex].hasNextPage){
            if(pageIndex === allPages.length - 1){
                setLoadingPage(true)
                const newNfts = await queryNfts(collectionAddress, allPages[pageIndex].nextPage)
                let newPages = {
                    nfts: newNfts.nfts,
                    nextPage: newNfts.nextPage,
                    hasNextPage: newNfts.hasNextPage
                }
                setAllPages(prev => [...prev, newPages])
                setPageIndex(newPageIndex)
                setNfts(newNfts.nfts)
                setLoadingPage(false)    
            }
            else {
                setPageIndex(newPageIndex)
                setNfts(allPages[newPageIndex].nfts)
            }
        }
    }
    
    function fetchPrevPage (){
        const newPageIndex = pageIndex > 0 ? pageIndex-1 : 0
        setPageIndex(newPageIndex)
        setNfts(allPages[newPageIndex].nfts)
    }
        
    return (
        <Box>
            {collection.banner ? <Image src={collection.banner} alt="cover image" w="100%" h="20em" objectFit="cover" /> : <></>}
            <Box m="2em">
                <Heading>{ collection.name || collectionAddress}</Heading>
                <Box maxW="40em">{collection.description || 'No description'}</Box>
                <h2>Stats {collection.multiContract ? '(all versions)' : ''}</h2>
                <StatGroup borderWidth="1px" borderRadius="lg" p="3" w="70%">
                    <Stat>
                        <StatLabel>Items</StatLabel>
                        <StatNumber>{collection.stats?.totalSupply ? <p>{collection.stats.totalSupply}</p> : <></>}</StatNumber>
                    </Stat>

                    <Stat>
                        <StatLabel>Floor</StatLabel>
                        <StatNumber>{collection.stats?.floorPrice ? <p>{collection.stats.floorPrice} ETH</p> : <></>}</StatNumber>
                        {/*<StatHelpText>
                        <StatArrow type='increase' />
                        69.420%
                        </StatHelpText>*/}
                    </Stat>

                    <Stat>
                        <StatLabel>Owners</StatLabel>
                        <StatNumber>{collection.stats?.numOwners ? <p>{collection.stats.numOwners}</p> : <></>}</StatNumber>
                        {/*<StatHelpText>
                        <StatArrow type='increase' />
                        69.420%
                        </StatHelpText>*/}
                    </Stat>

                    <Stat>
                        <StatLabel>Daily Sales</StatLabel>
                        <StatNumber>{collection.stats ? (collection.stats.day.sales ? <p>{collection.stats.day.sales} ETH</p> : <></>) : <></> }</StatNumber>
                        {/*<StatHelpText>
                        <StatArrow type='increase' />
                        69.420%
                        </StatHelpText>*/}
                    </Stat>

                    <Stat>
                        <StatLabel>Daily Volume</StatLabel>
                        <StatNumber>{collection.stats ? (collection.stats.day.volume ? <p>{Math.round(collection.stats.day.volume * 100) / 100} ETH</p> : <></>) : <></> }</StatNumber>
                        {/*<StatHelpText>
                        <StatArrow type='increase' />
                        69.420%
                        </StatHelpText>*/}
                    </Stat>
                </StatGroup>
                {
                    /*
                    collection.stats ?
                    ['day', 'week', 'month'].map(period => (
                        <div>
                            <p>{period}</p>
                            { collection.stats[period].sales ? <p>Sales: {collection.stats[period].sales}</p> : <></> }
                            { collection.stats[period].volume ? <p>Volume: {collection.stats[period].volume}</p> : <></> }
                            { collection.stats[period].change ? <p>Change: {collection.stats[period].change}</p> : <></> }
                            { collection.stats[period].averagePrice ? <p>Average price: {collection.stats[period].averagePrice}</p> : <></> }
                        </div>
                    )) : <></>*/
                }
                <Flex justify="flex-end" m="1em">
                    <Button mr="1em" onClick={fetchPrevPage} disabled={loadingPage}>Prev Page</Button>
                    <Button onClick={fetchNextPage} disabled={loadingPage}>Next Page</Button>
                </Flex>
                
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
            </Box>
        </Box>
    )
}