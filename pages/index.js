import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';

// const 

const networkInfo = {
    network: ZDKNetwork.Ethereum,
    chain: ZDKChain.Mainnet,
}

const API_ENDPOINT = "https://api.zora.co/graphql";
const args = { 
              endPoint:API_ENDPOINT, 
              networks:[networkInfo], 
              apiKey: process.env.API_KEY 
            } 

const zdk = new ZDK(args)

const collectionAddresses = ["0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d"]

export default function Home() {
  const [collectionInfos, setCollectionInfos] = useState([])
  const queryCollectionInfo = async () => {
    const newCollectionInfos = await zdk.collections({
      where: {
        collectionAddresses: collectionAddresses
      }
    })

    setCollectionInfos(Object.values(newCollectionInfos.collections.nodes))
  }

  useEffect(() => {
    queryCollectionInfo()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>AIG Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Collections</h1>
        {collectionInfos.map(collectionInfo => <CollectionCard key={collectionInfo.address} name={collectionInfo.name} description={collectionInfo.description} address={collectionInfo.address}/>)}
        {JSON.stringify(collectionInfos)}
      </main>
    </div>
  )
}
