import Head from 'next/head'
import {useEffect, useState} from 'react'
import {queryArtists} from '../common/interface'
import ArtistCard from '../components/ArtistCard';
import { Flex, Box } from '@chakra-ui/react';

export default function artists(){
    const [artist, setArtist] = useState([]);
    const fetchArtists = async () => {
        const newArtists = await queryArtists();
        setArtist(newArtists);
    }

    useEffect(() => {
        fetchArtists()
    })
    return (
        <div>
            <Head>
                <title>AIG Data</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Flex m="1em" wrap="wrap" justify="space-around" align="center">
            {
                    artist.map(
                        artistInfo => 
                        <Box my="1em" key={artistInfo.address}>
                            <ArtistCard key={artistInfo.address} name={artistInfo.name} description={artistInfo.description} address={artistInfo.address} coverUrl={artistInfo.coverImage}/>
                        </Box>
                    )
                }
                {/* {JSON.stringify(collectionInfos)} */}
            </Flex>
        </div>
    )
}