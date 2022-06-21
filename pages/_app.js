import '../styles/globals.css'
import { ChakraProvider, extendTheme } from '@chakra-ui/react'
import Header from '../components/Header'
import Head from 'next/head'
import Fonts from "../components/Fonts"

const theme = extendTheme({
  fonts: {
    heading: "Anek Malayalam",
    body: "Anek Malayalam",
  },
})

function MyApp({ Component, pageProps }) {
  return (
    <ChakraProvider theme={theme}>
        <Fonts />
        <Head>
            <Head>
            <link rel="preconnect" href="https://fonts.googleapis.com"/>
            <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin/>
            <link href="https://fonts.googleapis.com/css2?family=Anek+Malayalam&family=DM+Mono&display=swap" rel="stylesheet"/> 
        </Head>
        </Head>
        <Header />
        <Component {...pageProps} />
    </ChakraProvider>
  )
}

export default MyApp
