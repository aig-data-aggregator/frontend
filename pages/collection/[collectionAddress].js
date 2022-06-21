import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import NftCard from '../../components/NftCard';

import { addressToCollections, queryNfts } from '../../common/interface'

export default function CollectionsPage () {
    const [pageIndex, setPageIndex] = useState(0)
    const [allPages, setAllPages] = useState([])
    const [nfts, setNfts] = useState([])
    const [loadingPage, setLoadingPage] = useState(false)
    /*
    nftsPages
        {
            nfts: [],
            nextPage: ""
        }
    */
    // const [pageInfo, setPageInfo] = useState()
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
            nextPage: newNfts.nextPage
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
        if(pageIndex === allPages.length - 1){
            setLoadingPage(true)
            const newNfts = await queryNfts(collectionAddress, allPages[pageIndex].nextPage)
            let newPages = {
                nfts: newNfts.nfts,
                nextPage: newNfts.nextPage
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
    
    function fetchPrevPage (){
        const newPageIndex = pageIndex > 0 ? pageIndex-1 : 0
        setPageIndex(newPageIndex)
        setNfts(allPages[newPageIndex].nfts)
    }
        
    return (
        <div>
            <button onClick={fetchPrevPage} disabled={loadingPage}>Prev Page</button>
            <button onClick={fetchNextPage} disabled={loadingPage}>Next Page</button>
            <h2>Stats {collection.multiContract ? '(all versions)' : ''}</h2>
            {collection.banner ? <img src={collection.banner} /> : <></>}
            <h1>{ collection.name || collectionAddress}</h1>
            <p>{collection.description || 'No description'}</p>
            {collection.stats?.totalSupply ? <p>{collection.stats.totalSupply} NFTs</p> : <></>}
            {collection.stats?.floorPrice ? <p>Floor: {collection.stats.floorPrice} ETH</p> : <></>}
            {collection.stats?.numOwners ? <p>{collection.stats.numOwners} owners</p> : <></>}
            {
                collection.stats ?
                ['day', 'week', 'month', 'total'].map(period => (
                    <div>
                        <p>{period}</p>
                        { collection.stats[period].sales ? <p>Sales: {collection.stats[period].sales}</p> : <></> }
                        { collection.stats[period].volume ? <p>Volume: {collection.stats[period].volume}</p> : <></> }
                        { collection.stats[period].change ? <p>Change: {collection.stats[period].change}</p> : <></> }
                        { collection.stats[period].averagePrice ? <p>Average price: {collection.stats[period].averagePrice}</p> : <></> }
                    </div>
                )) : <></>
            }
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