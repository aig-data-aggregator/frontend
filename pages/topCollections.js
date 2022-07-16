import Head from 'next/head'
import { useEffect, useState } from 'react';
import {queryTopCollections} from '../common/interface';
import { Flex, Box, Image, Text, Badge } from '@chakra-ui/react';
import CollectionCard from '../components/CollectionCard';
import { useCurrencyConverter } from '../common/currency';

export default function TopCollections() {
    const [collections, setCollections] = useState([]);
    const [period, setPeriod] = useState('day');
    const convert = useCurrencyConverter()

    async function changePeriod(newPeriod) {
        setPeriod(newPeriod);
        const newCollections = await queryTopCollections(newPeriod)
        setCollections(newCollections);
    }

    useEffect(() => {
        changePeriod(period)
    })

    return (
        <div>
            <div style={{height:'200px'}} />
            <Head>
                <title>AIG Data</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex m="1em" wrap="wrap" justify="space-around" align="center">
                <select
                    value={period}
                    onChange={(e) => {
                    changePeriod(e.target.value);
                    }}
                >
                    <option value="day">Last Day</option>
                    <option value="week">Last Week</option>
                    <option value="month">Last Month</option>
                    <option value="all">All</option>
                </select>

                {
                    collections.map(collection => {
                        return (
                            <Box w="sm" borderWidth="1px" borderRadius="lg" overflow="hidden" h="md" key={collection.rank}>
                                <Image src={collection.iconUrl} fallbackSrc="https://via.placeholder.com/500" alt={"Collection's Cover image"} w="100%" h="15em" overflow="hidden" objectFit="cover" />
                                <Box p="6">
                                    <Box display="flex" alignItems="baseline">
                                        <Badge borderRadius="full" px="2" colorScheme="teal">#{collection.rank} rank</Badge>
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
                                    {collection.contractName}
                                </Box>
                                <Box
                                    mt='1'
                                    fontWeight='regular'
                                    as='h4'
                                    lineHeight='tight'
                                    noOfLines={2}

                                    >
                                    <Text as="i">Value: {convert(collection.value, collection.baseCurrency)} </Text>
                                </Box>
                            </Box>
                        )
                    })
                }
            </Flex>
        </div>
    )
}