import React, { useState } from "react";
import { Flex, Spacer, Heading, HStack, Link, Input, Button, Box } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useEns } from "../common/ens";
import { useReadProvider } from "../common/provider";

export default function Header() {
    const router = useRouter()
    const [readProvider, _] = useReadProvider()
    const { resolveAsync } = useEns()
    const [query, setQuery] = useState('')
    const search = async (e) => {
        e.preventDefault()
        console.log('Query:', query)
        let actualQuery;
        let code;
        try {
            if (query.endsWith('.eth')) {
                actualQuery = await resolveAsync(query)
            } else {
                actualQuery = query;
            }
            console.log('Actual query', actualQuery)

            code = await readProvider.getCode(actualQuery)
        } catch {
            return;
        }
        if (code == '0x') {
            router.push('/artist/' + actualQuery)
        } else {
            router.push('/collection/' + actualQuery)
        }
    }
    return (
        <Box pos="fixed" w="100%" mb="1em" borderBottom="1px" borderColor="#ccc" bg="white" zIndex={69}>
            <Flex align="center" direction="row" p="0.2em" pl="1em" >
                <Link href="/"><Heading>AIG</Heading></Link>
                <form onSubmit={search}>
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Insert address or ENS" mx="2em" />
                </form>
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