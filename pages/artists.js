import Head from 'next/head'
import {useEffect, useState} from 'react'
import {queryArtists} from '../common/interface'
import ArtistCard from '../components/ArtistCard';
import { Flex, Box } from '@chakra-ui/react';

export default function Artists(){
    const [artist, setArtist] = useState([])
    const fetchArtists = async () => {
        const newArtists = await queryArtists();
        setArtist(newArtists);
    }

    useEffect(() => {
        fetchArtists()
    })
    return (
        <Box pt="4em">
            <Head>
                <title>AIG Data</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex m="1em" wrap="wrap" justify="space-around" align="center">
            {
                    artist.map(
                        artistInfo => 
                        <Box my="1em" key={artistInfo.address}>
                            <ArtistCard key={artistInfo.address} {...artistInfo}/>
                        </Box>
                    )
                }
                {/* {JSON.stringify(collectionInfos)} */}
            </Flex>
        </Box>
    )
}