import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { queryCollections, getCategories } from '../common/interface';

import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';


export default function Home() {
  const [collections, setCollections] = useState([]);
  const [categories, setCategories] = useState([]);
  const [categoriesChecked, setCategoriesChecked] = useState([]);

  const fetchCollections = async () => {
    const newCollections = await queryCollections();
    setCollections(newCollections);
  }

  const fetchCategories = () => {
    const newCategories = getCategories();
    setCategoriesChecked(newCategories)
    setCategories(newCategories);
  }

  function handleCategoryChange(event){
    const { value, checked } = event.target;
    if(checked){
      setCategoriesChecked([...categoriesChecked, value]);
    }
    else{
      setCategoriesChecked(categoriesChecked.filter(category => category !== value));
    }
  }

  function toBeDisplayed(collection) {
    let tags = collection.tags;
    for(let tag of tags){
      if(categoriesChecked.includes(tag)){
        return true;
      }
    }
    return false
  }

  useEffect(() => {
    fetchCategories()
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
        {categories.map(category => <label key={category}><input type="checkbox" value={category} defaultChecked={categoriesChecked.includes(category)} onChange={handleCategoryChange}/>{category}</label>)}
        {collections.map(collectionInfo => toBeDisplayed(collectionInfo) && <CollectionCard key={collectionInfo.address} name={collectionInfo.name} description={collectionInfo.description} address={collectionInfo.address} coverUrl={collectionInfo.coverImage}/>)}
        {/* {JSON.stringify(collectionInfos)} */}
      </main>
    </div>
  )
}
