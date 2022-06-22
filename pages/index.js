import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'

import { queryCollections, getCategories } from '../common/interface';

import { useEffect, useState } from 'react';
import CollectionCard from '../components/CollectionCard';
import Header from '../components/Header';
import { Flex, Box, Checkbox } from '@chakra-ui/react';


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
    <div>
      <Head>
        <title>AIG Data</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Flex pt="6em" ml="1em" justify="center">
        {categories.map(category => <Checkbox mr="2em" value={category} key={category} defaultChecked={categoriesChecked.includes(category)} onChange={handleCategoryChange}>{category}</Checkbox>)}
      </Flex>
        <Flex m="1em" wrap="wrap" justify="space-around" align="center">
       {
            collections.map(
                collectionInfo => toBeDisplayed(collectionInfo)
                &&
                <Box my="1em" key={collectionInfo.address}>
                    <CollectionCard key={collectionInfo.address} name={collectionInfo.name} description={collectionInfo.description} address={collectionInfo.address} coverUrl={collectionInfo.coverImage}/>
                </Box>
            )
        }
        {/* {JSON.stringify(collectionInfos)} */}
      </Flex>
    </div>
  )
}
