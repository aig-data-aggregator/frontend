import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';
import EventCard from '../../components/EventCard';
import {Button, Box} from "@chakra-ui/react";
import { Tabs, TabList, TabPanels, Tab, TabPanel, Flex} from '@chakra-ui/react'

import { nftsOwnedByAddress, nftsMintedByAddress, querySingleArtist } from '../../common/interface'
import { useSession } from "next-auth/react";

export default function ArtistPage(){
    const router = useRouter()
    const { artistAddress } = router.query
    const [nftsOwned, setNftsOwned] = useState([])
    const [nftsMinted, setNftsMinted] = useState([])

    const [allOwned, setAllOwned] = useState([])
    const [pageIndexOwned, setPageIndexOwned] = useState(0)
    const [loadingOwned, setLoadingOwned] = useState(false)

    const [allMinted, setAllMinted] = useState([])
    const [pageIndexMinted, setPageIndexMinted] = useState(0)
    const [loadingMinted, setLoadingMinted] = useState(false)
    const [artistInfo, setArtistInfo] = useState(null)
    const [relatedEvents, setRelatedEvents] = useState(null)

    const { data: session, status } = useSession()
    
    const filterDuplicates = (toBeFiltered, allNfts) => {
        return toBeFiltered.filter(nft => !allNfts.find(
            nftSet => nftSet.nfts.find(otherNft => nft.collectionAddress == otherNft.collectionAddress && nft.tokenId == otherNft.tokenId)
        ))
    }


    const fetchNfts = () => {
        nftsMintedByAddress(artistAddress).then(newMinted => {
            setAllMinted([{
                nfts: newMinted.nfts,
                nextPage: newMinted.nextPage,
                hasNextPage: newMinted.hasNextPage
            }])
            setNftsMinted(newMinted.nfts)
            setPageIndexMinted(0)
        })
        nftsOwnedByAddress(artistAddress).then(newOwned => {
            setAllOwned([{
                nfts: newOwned.nfts,
                nextPage: newOwned.nextPage,
                hasNextPage: newOwned.hasNextPage
            }])
            setNftsOwned(newOwned.nfts)
            setPageIndexOwned(0)
        })
    }

    async function fetchNextOwnedPage(){
        const newPageIndex = pageIndexOwned + 1
        if(allOwned[pageIndexOwned].hasNextPage){
            if(pageIndexOwned === allOwned.length - 1){
                setLoadingOwned(true)
                const newNftsOwned = await nftsOwnedByAddress(artistAddress, allOwned[pageIndexOwned].nextPage)
                const actualNewNftsOwned = filterDuplicates(newNftsOwned.nfts, allOwned)
                let newPages = {
                    nfts: actualNewNftsOwned,
                    nextPage: newNftsOwned.nextPage
                }
                setAllOwned(prev => [...prev, newPages])
                setPageIndexOwned(newPageIndex)
                setNftsOwned(actualNewNftsOwned)
                setLoadingOwned(false)
            }
            else {
                setPageIndexOwned(newPageIndex)
                setNftsOwned(allOwned[newPageIndex].nfts)
            }
        }
    }

    async function fetchPrevOwnedPage(){
        const newPageIndex = pageIndexOwned > 0 ? pageIndexOwned - 1 : 0
        setPageIndexOwned(newPageIndex)
        setNftsOwned(allOwned[newPageIndex].nfts)
    }

    async function fetchNextMintedPage(){
        const newPageIndex = pageIndexMinted + 1
        if(allMinted[pageIndexMinted].hasNextPage){
            if(pageIndexMinted === allMinted.length - 1){
                setLoadingMinted(true)
                const newNftsMinted = await nftsMintedByAddress(artistAddress, allMinted[pageIndexMinted].nextPage)
                const actualNewNftsMinted = filterDuplicates(newNftsMinted.nfts, allMinted)
                let newPages = {
                    nfts: actualNewNftsMinted,
                    nextPage: newNftsMinted.nextPage
                }
                setAllMinted(prev => [...prev, newPages])
                setPageIndexMinted(newPageIndex)
                setNftsMinted(actualNewNftsMinted)
                setLoadingMinted(false)
            }
            else {
                setPageIndexMinted(newPageIndex)
                setNftsMinted(allMinted[newPageIndex].nfts)
            }
        }
    }

    async function fetchPrevMintedPage(){
        const newPageIndex = pageIndexMinted > 0 ? pageIndexMinted - 1 : 0
        setPageIndexMinted(newPageIndex)
        setNftsMinted(allMinted[newPageIndex].nfts)
    }

    async function fetchRelatedEvents() {
        const newRelatedEvents = await fetch('/api/events?artist=' + encodeURI(artistAddress)).then(res => res.json())
        setRelatedEvents(newRelatedEvents)
    }

    useEffect(() => {
        if (artistAddress) {
            fetchNfts()
            fetchRelatedEvents()
        }
        querySingleArtist(artistAddress).then(newInfo => setArtistInfo(newInfo))
    }, [artistAddress])

    return (
        <Box pt="5em">
            <div style={{height:"200px"}}></div>
            <Tabs variant="soft-rounded" align="center" p="2">
                { session?.user && session?.address === artistAddress && <a href={`/artist/${artistAddress}/edit`}>Edit</a>}
                <p>{JSON.stringify(artistInfo)}</p>
                <TabList>
                    <Tab>Minted</Tab>
                    <Tab>Collected</Tab>
                    <Tab>Events</Tab>
                </TabList>

                <TabPanels>
                    <TabPanel>
                        <Flex align="end" justify="flex-end">
                            <Button mr="1em" onClick={fetchPrevMintedPage} disabled={loadingMinted || pageIndexMinted===0}>Prev</Button>
                            <Button onClick={fetchNextMintedPage} disabled={loadingMinted || !allMinted[pageIndexMinted]?.hasNextPage}>Next</Button>
                        </Flex>
                                                <Box style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                margin: "auto",
                                alignItems: "center",
                            }}>
                            {nftsMinted.map(nft => (
                                <NftCard key={nft.collectionAddress + nft.tokenId} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={nft.collectionAddress} nftId={nft.tokenId}/>
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                        <Flex align="end" justify="flex-end">
                            <Button mr="1em" onClick={fetchPrevOwnedPage} disabled={loadingOwned || pageIndexOwned===0}>Prev</Button>
                            <Button onClick={fetchNextOwnedPage} disabled={loadingOwned || !allOwned[pageIndexOwned]?.hasNextPage}>Next</Button>
                        </Flex>
                       <Box style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                margin: "auto",
                                alignItems: "center",
                            }}>
                            {nftsOwned.map(nft => (
                                <NftCard key={nft.collectionAddress + nft.tokenId} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={nft.collectionAddress} nftId={nft.tokenId}/>
                            ))}
                        </Box>
                    </TabPanel>
                    <TabPanel>
                       <Box style={{
                                display: "flex",
                                flexWrap: "wrap",
                                justifyContent: "space-between",
                                margin: "auto",
                                alignItems: "center",
                            }}>
                            {relatedEvents && relatedEvents.map(event => 
                                <EventCard {...event} />    
                            )}
                        </Box>
                    </TabPanel>
                </TabPanels>
                </Tabs>
            
           
        </Box>
    )
}