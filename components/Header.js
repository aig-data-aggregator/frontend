import React from "react";
import { Flex, Spacer, Heading, HStack, Link, Input, Button, Box } from "@chakra-ui/react"

export default function Header() {
    return (
        <Box pos="fixed" w="100%" mb="1em" borderBottom="1px" borderColor="#ccc" bg="white" zIndex={69}>
            <Flex align="center" direction="row" p="0.2em" pl="1em" >
                <Link href="/"><Heading>AIG</Heading></Link>
                <Input placeholder="Search items, collections, accounts" mx="2em" />
                <Flex justify="right" align="center" mr="3">
                    <Button colorScheme="teal" bgColor="black">Connect Wallet</Button>
                </Flex>
            </Flex>
            <Flex align="center" ml="2em">
                <Link href="/" mr="2em">Collections</Link>
                <Link mr="2em">Artworks</Link>
                <Link href="/artists" mr="2em">Artists</Link>
            </Flex>
        </Box>
        
    )
}