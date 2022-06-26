import React, {useEffect, useState} from "react";
import Link from "next/link"
import { Box, Image, Badge, Text } from "@chakra-ui/react"
import {addressToArtist} from "../common/interface"
import { useEns } from "../common/ens";

export default function ArtistCard({name, coverUrl, description, address}) {
    const [artist, setArtist] = useState()
    const [avatar, setAvatar] = useState()
    const [artistEmail, setArtistEmail] = useState()
    const [artistTwitter, setArtistTwitter] = useState()
    const { getAvatarAsync, getTextAsync } = useEns()

    const queryArtist = async () => {
        const singleArtistInfo = await addressToArtist(address)
        setArtist(singleArtistInfo)
    }


    useEffect(() => {
        queryArtist()
    },[])

    useEffect(() => {
        getAvatarAsync(address).then(newAvatar => setAvatar(newAvatar))
        getTextAsync(address, "email").then(mail => setArtistEmail(mail))
        getTextAsync(address, "com.twitter").then(twitter => setArtistTwitter(twitter))
    }, [address])

    return (
        <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" h="md">
            <Image src={coverUrl || avatar} fallbackSrc="https://via.placeholder.com/500" alt={"Artist's Cover image"} w="100%" h="15em" overflow="hidden" objectFit="cover" />
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
                        {"Total NFTs: " + (artist?.stats?.count || "N/A") }
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

                <Box
                    mt='1'
                    fontWeight='regular'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={2}
                    >
                    <Text as="i">{artistEmail ? "Mail: " + artistEmail : ""}</Text>
                </Box>
                <Box
                    mt='1'
                    fontWeight='regular'
                    as='h4'
                    lineHeight='tight'
                    noOfLines={2}
                    >
                    <Text as="i">Twitter: {artistTwitter ? <a href={`https://twitter.com/${artistTwitter}`}  target="_blank" rel="noopener noreferrer"> @{artistTwitter} </a> : ""}</Text>
                </Box>
                <Box fontWeight="bold">
                    {"Floor Price: " + (artist?.stats?.floorPrice || "N/A")}
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