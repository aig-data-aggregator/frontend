import React, { useState } from "react";
import { Flex, Spacer, Heading, HStack, Link, Input, Button, Box, Text } from "@chakra-ui/react"
import { useRouter } from "next/router";
import { useEns } from "../common/ens";
import { useReadProvider } from "../common/provider";
import { signOut, useSession } from "next-auth/react"
import { getCsrfToken, signIn } from 'next-auth/react'
import { SiweMessage } from 'siwe'
import { useConnect, useSignMessage } from 'wagmi'
import truncateEthAddress from 'truncate-eth-address'

export default function Header() {
    const router = useRouter()
    const [readProvider, _] = useReadProvider()
    const { resolveAsync } = useEns()
    const [query, setQuery] = useState('')
    const { data: session, status } = useSession()

    const { connectors, connectAsync} = useConnect()
    const { signMessageAsync } = useSignMessage()

    const loading = status === "loading"
    const search = async (e) => {
        e.preventDefault()
        let actualQuery;
        let code;
        try {
            if (query.endsWith('.eth')) {
                actualQuery = await resolveAsync(query)
            } else {
                actualQuery = query;
            }

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

    const handleLogin = async () => {
        const res = await connectAsync({connector: connectors[0]});
        const callbackUrl = '/protected';
        const message = new SiweMessage({
          domain: window.location.host,
          address: res.account,
          statement: 'Sign in with Ethereum to AIG.',
          uri: window.location.origin,
          version: '1',
          chainId: 1,//res.data?.chain?.id,
          nonce: await getCsrfToken()
        });
        // const {data: signature, error} = await signMessageAsync({ message: message.prepareMessage() });
        const signature = await signMessageAsync({ message: message.prepareMessage() });
        signIn('credentials', { message: JSON.stringify(message), redirect: false, signature, callbackUrl });
      
    }

    return (
        <Box pos="fixed" w="100%" mb="1em" borderBottom="1px" borderColor="#ccc" bg="white" zIndex={69}>
            <Flex align="center" direction="row" p="0.2em" pl="1em" justify="space-between">
                <Link href="/">
                    <Heading>AIG</Heading>
                </Link>
                <form onSubmit={search}>
                    <Input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Insert address or ENS" mx="2em" width="xl" />
                </form>
                <Box>
                    {!session && (
                        <Button mr="2"
                            onClick={(e) => {
                                e.preventDefault()
                                handleLogin()
                            }}
                            >
                            Sign-In with Ethereum
                        </Button>
                    )}
                    {session?.user && (
                        <Flex>
                            {session.user.image && (
                                <></>// <img src={session.user.image} /> 
                            )}
                            <Box mr="2">
                                <Text fontSize="xs">Signed in as</Text>
                                <Text fontSize="s" lineHeight="0.8">{session.user.email ?? truncateEthAddress(session.user.name)}</Text>
                            </Box>
                            <Button mr="2"
                                href={`/api/auth/signout`}
                                onClick={(e) => {
                                e.preventDefault()
                                signOut()
                                }}
                            >
                                Sign out
                            </Button>
                        </Flex>
                    )}
                </Box>
            </Flex>
            <Flex align="center" ml="2em">
                <Link href="/" mr="2em">Collections</Link>
                <Link href="/topCollections" mr="2em">Top 100 Collections</Link>
                <Link href="/artworks" mr="2em">Artworks</Link>
                <Link href="/artists" mr="2em">Artists</Link>
                {session?.user && <Link href={"/artist/"+session.address} mr="2em">Personal page</Link>}
            </Flex>

          
        </Box>
    )
}