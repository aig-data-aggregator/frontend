import React, {useEffect, useState} from "react";
import Link from "next/link"
import { Box, Image, Badge, Text } from "@chakra-ui/react"
import {addressToArtist} from "../common/interface"

export default function ArtistCard({name, coverUrl, description, address}) {
    const [artist, setArtist] = useState()

    const queryArtist = async () => {
        const singleArtistInfo = await addressToArtist(address)
        setArtist(singleArtistInfo)
    }

    useEffect(()=>{
        queryArtist()
    },[])
    return (
        <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" h="md">
            <Image src={coverUrl} fallbackSrc="https://via.placeholder.com/500" alt={"Artist's Cover image"} w="100%" h="15em" overflow="hidden" objectFit="cover" />
            <Box p="6">
                <Box display="flex" alignItems="baseline">
                    {artist?.tags.map(tag=>
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
                        {"Total NFTs: " + (artist?.stats?.count || "NA") }
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
                    {"Floor Price: " + (artist?.stats?.floorPrice || "NA")}
                </Box>
                <Link href={`/artist/${address}`}>
                    <a style={{
                        color: "red",
                        textDecoration: "underline"
                    }}>See more</a>
                </Link>
            </Box>
        </Box>
    )
}