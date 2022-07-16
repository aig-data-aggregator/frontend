import React, {useEffect, useState} from "react";
import Link from "next/link"
import { Box, Image, Badge, Text } from "@chakra-ui/react"
import {addressToCollections} from "../common/interface"
import { useRouter } from "next/router";
import { useCurrencyConverter } from "../common/currency";

export default function CollectionCard({name, coverUrl, description, address}) {
    const [collection, setCollection] = useState()
    const convert = useCurrencyConverter()

    const queryCollection = async () => {
        const singleCollectionInfo = await addressToCollections(address)
        setCollection(singleCollectionInfo)
    }

    const router = useRouter()

    useEffect(()=>{
        queryCollection()
    },[])
    return (
        <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" h="md" onClick={() => router.push(`/collection/${address}`)} cursor="pointer">
            <Image src={coverUrl} fallbackSrc="https://via.placeholder.com/500" alt={"Collection's Cover image"} w="100%" h="15em" overflow="hidden" objectFit="cover" />
            <Box p="6">
                <Box display="flex" alignItems="baseline">
                    {collection?.tags.map(tag=>
                        <Badge borderRadius="full" px="2" colorScheme="teal" key={tag}>{tag}</Badge>
                    )}  
                    <Box
                        color='gray.500'
                        fontWeight='semibold'
                        letterSpacing='wide'
                        fontSize='xs'
                        textTransform='uppercase'
                        ml='2'
                    >
                        {"Total NFTs: " + (collection?.stats?.count || "NA") }
                    </Box>
                </Box>
                <Box
                    mt='1'
                    fontWeight='semibold'
                    as='h3'
                    fontSize="xl"
                    lineHeight='tight'
                    noOfLines={1}
                    >
                    {name}
                </Box>
                <Box
                    mt='1'
                    fontWeight='regular'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={2}

                    >
                    <Text as="i">{description}</Text>
                </Box>
                <Box fontWeight="bold">
                    Floor Price: {convert(collection?.stats?.floorPrice, 'ETH') || "NA"}
                </Box>
            </Box>
        </Box>
    )
}