import Link from "next/link";
import React from "react";
import { Box, Image, Badge, Text } from "@chakra-ui/react"

export default function NftCard({name, description, thumbnail, collectionAddress, nftId}) {
    return (
        <Box w="xs" borderWidth="1px" borderRadius="lg" overflow="hidden" mb="2em">
            <Image src={thumbnail} fallbackSrc="https://via.placeholder.com/500" alt={"Collection's Cover image"} w="100%" objectFit="cover" />
            <Box p="6">
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
                    PRICE: 11 ETH
                </Box>
                <Link href={`/nft/${collectionAddress}/${nftId}`}>
                    <a style={{
                        color: "red",
                        textDecoration: "underline"
                    }}>See more</a>
                </Link>
            </Box>
        </Box>
    )
}