import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { queryCollections } from '../common/interface';

import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';


export default function Home() {
  const [collections, setCollections] = useState([]);

  const fetchCollections = async () => {
    const newCollections = await queryCollections();
    setCollections(newCollections);
  }

  useEffect(() => {
    fetchCollections()
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>AIG Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <h1>Collections</h1>

        {collections.map(collectionInfo => <CollectionCard key={collectionInfo.address} name={collectionInfo.name} description={collectionInfo.description} address={collectionInfo.address}/>)}
        {/* {JSON.stringify(collectionInfos)} */}
      </main>
    </div>
  )
}
