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

import { isModerator } from '../common/interface'

import { useRecoilState } from "recoil";
import { targetCurrencyState, CURRENCIES } from "../common/currency";

export default function Header() {
    const router = useRouter()
    const [readProvider, _] = useReadProvider()
    const { resolveAsync } = useEns()
    const [query, setQuery] = useState('')
    const { data: session, status } = useSession()
    const [searchType, setSearchType] = useState('all')
    const [autoCompleteController, setAutoCompleteController] = useState(null)
    const [suggestions, setSuggestions] = useState(null)

    const { connectors, connectAsync} = useConnect()
    const { signMessageAsync } = useSignMessage()

    const [targetCurrency, settargetCurrency] = useRecoilState(targetCurrencyState)

    const loading = status === "loading"
    const search = async (address) => {
        let actualAddress;
        let code;
        try {
            if (query.endsWith('.eth')) {
                actualAddress = await resolveAsync(address)
            } else {
                actualAddress = address;
            }

            code = await readProvider.getCode(actualAddress)
        } catch {
            return;
        }
        if (code == '0x') {
            router.push('/artist/' + actualAddress)
        } else {
            router.push('/collection/' + actualAddress)
        }
    }

    const autoComplete = (query) => {
        if (!query) {
            return
        }
        if (autoCompleteController) {
            autoCompleteController.abort()
        }
        let controller = new AbortController()
        const promises = []
        if (['artist', 'all'].includes(searchType)) {
            promises.push(fetch('/api/artists?search=' + encodeURI(query), {
                signal: controller.signal
            }))
        }

        if (['collection', 'all'].includes(searchType)) {
            promises.push(fetch('/api/collections?search=' + encodeURI(query), {
                signal: controller.signal
            }))
        }

        Promise.all(promises)
            .then(resArray => Promise.all(resArray.map(res => res.json())))
            .then(resArray => {
                const allResults = []
                for (const res of resArray) {
                    console.log(res)
                    allResults.push(...res)
                }
                console.log(allResults)
                setSuggestions(allResults)
            })
        setAutoCompleteController(controller)
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
                <select value={searchType} onChange={e => setSearchType(e.target.value)}>
                    <option value="all">All</option>
                    <option value="artist">Artists</option>
                    <option value="collection">Collections</option>
                </select>
                <form onSubmit={(e) => {e.preventDefault(); search(query)}}>
                    <Input value={query} onChange={(e) => {setQuery(e.target.value); autoComplete(e.target.value)}} placeholder="Insert address or ENS" mx="2em" width="xl" />
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
                <Link href="/news" mr="2em">News</Link>
                {session?.user && <Link href={"/artist/"+session.address} mr="2em">Personal page</Link>}
                {
                    session?.user && isModerator(session.address) && (
                        <Link href={"/admin"} mr="2em">Admin</Link>
                    )
                }
                <select value={targetCurrency} onChange={e => settargetCurrency(e.target.value)}>
                    {
                        CURRENCIES.map(currency => (
                            <option value={currency}>{currency}</option>
                        ))
                    }
                </select>
            </Flex>
            {JSON.stringify(suggestions)}
            {
                suggestions && suggestions.map(suggestion => (
                    <label>{suggestion.name}<button onClick={() => search(suggestion.address)}>Go</button></label>
                ))
            }
        </Box>
    )
}