import React, { useEffect, useState } from "react";
import { useRouter } from "next/router"
import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { addressToCollections, queryNftInfo } from '../../../common/interface.js'
import { Box, Heading, Flex, Image, Text, Link } from "@chakra-ui/react"
import { ExternalLinkIcon } from "@chakra-ui/icons"

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
        <Box pt="8em" ml="2em" pr="1em">
            <Flex>
                <Image w="2xl" h="2xl" src={nftInfo.url} alt="nft media" mr="1em"/>
                <Box>
                    <Text>Minted by <Link href={`https://etherscan.io/address/${nftInfo.minter}`} target="_blank" rel="noopener noreferrer">{nftInfo.minter}</Link></Text>
                    <Heading fontSize="6xl">{nftInfo.name}</Heading>
                    <Text as="i" fontSize="xl">{nftInfo.description}</Text>

                    <Heading mt="2em" fontSize="3xl">Current Owner</Heading>
                    <Link href={`https://etherscan.io/address/${nftInfo.owner}`} target="_blank" rel="noopener noreferrer">{nftInfo.owner}</Link>
                    <Box>
                        <Text fontSize="3xl" mt="1em">Recent sales</Text>
                        <Box h="20em" overflow="auto">
                        {
                            nftInfo.sales.map(sale => (
                                <Box key={sale.hash} mb="1em">
                                    <Text>SELLER</Text>
                                    <Text>{sale.seller}</Text>
                                    <Text>BUYER</Text>
                                    <Text>{sale.buyer}</Text>
                                    <Text>Price: {sale.nativePrice.amount} {sale.nativePrice.currency} ({Math.floor(sale.usdPrice * 100) / 100} USD)</Text>
                                    <Text>{sale.timestamp}</Text>
                                    <Link href={`https://etherscan.io/tx/${sale.hash}`} target="_blank" rel="noopener noreferrer"><ExternalLinkIcon/>View on Etherscan</Link>
                                    <hr/>

                                </Box>
                            ))
                        }
                        </Box>
                    </Box>
                </Box>
            </Flex>
            { collectionInfo && collectionInfo.nftUrl ? <a href={collectionInfo.nftUrl.replace('{id}', nftId)} target="_blank" rel="noopener noreferrer"><ExternalLinkIcon/>View on {collectionInfo.platform}</a> : <></> }
            <p></p>
        </Box>
    )
}