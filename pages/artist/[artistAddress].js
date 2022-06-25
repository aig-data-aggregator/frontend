import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';
import {Button} from "@chakra-ui/react";

import { nftsOwnedByAddress, nftsMintedByAddress } from '../../common/interface'

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
    
    const filterDuplicates = (toBeFiltered, allNfts) => {
        return toBeFiltered.filter(nft => !allNfts.find(
            nftSet => nftSet.nfts.find(otherNft => nft.collectionAddress == otherNft.collectionAddress && nft.tokenId == otherNft.tokenId)
        ))
    }


    const fetchNfts = () => {
        nftsMintedByAddress(artistAddress).then(newMinted => {
            setAllMinted([{
                nfts: newMinted.nfts,
                nextPage: newMinted.nextPage
            }])
            setNftsMinted(newMinted.nfts)
            setPageIndexMinted(0)
        })
        nftsOwnedByAddress(artistAddress).then(newOwned => {
            setAllOwned([{
                nfts: newOwned.nfts,
                nextPage: newOwned.nextPage
            }])
            setNftsOwned(newOwned.nfts)
            setPageIndexOwned(0)
        })
    }

    async function fetchNextOwnedPage(){
        const newPageIndex = pageIndexOwned + 1
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

    async function fetchPrevOwnedPage(){
        const newPageIndex = pageIndexOwned > 0 ? pageIndexOwned - 1 : 0
        setPageIndexOwned(newPageIndex)
        setNftsOwned(allOwned[newPageIndex].nfts)
    }

    async function fetchNextMintedPage(){
        const newPageIndex = pageIndexMinted + 1
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

    async function fetchPrevMintedPage(){
        const newPageIndex = pageIndexMinted > 0 ? pageIndexMinted - 1 : 0
        setPageIndexMinted(newPageIndex)
        setNftsMinted(allMinted[newPageIndex].nfts)
    }

    useEffect(() => {
        if (artistAddress) {
            fetchNfts()
        }
    }, [artistAddress])

    return (
        <div>
            <div style={{height:'200px'}} />
            <Button onClick={fetchPrevOwnedPage} disabled={loadingOwned}>Prev Owned</Button>
            <Button onClick={fetchNextOwnedPage} disabled={loadingOwned}>Next Owned</Button>
            <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    margin: "auto",
                    alignItems: "center",
                }}>
                {nftsOwned.map(nft => (
                    <NftCard key={nft.collectionAddress + nft.tokenId} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={nft.collectionAddress} nftId={nft.tokenId}/>
                ))}
            </div>
            <Button onClick={fetchPrevMintedPage} disabled={loadingMinted}>Prev Minted</Button>
            <Button onClick={fetchNextMintedPage} disabled={loadingMinted}>Next Minted</Button>
        
            <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    justifyContent: "space-between",
                    margin: "auto",
                    alignItems: "center",
                }}>
                {nftsMinted.map(nft => (
                    <NftCard key={nft.collectionAddress + nft.tokenId} name={nft.name} description={nft.description} thumbnail={nft.thumbnail} collectionAddress={nft.collectionAddress} nftId={nft.tokenId}/>
                ))}
            </div>
        </div>
    )
}