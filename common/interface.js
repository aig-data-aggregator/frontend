import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { collections } from "./collections";
//import { collections as collectionsJson } from "../static/collections.json"

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

const queryCollections = async () => {
    return collections
}

const addressToCollections = async (address) => {
    const collections = await queryCollections()
    if(collections.map(collection=>collection.address).includes(address))
        return collections.filter(collection => collection.address === address)[0]
    else{
        // fallback
        let info = await zdk.collections({
            where: {
                collectionAddresses: [address]
            }
        })
        info = info.collections.nodes[0]
        return {
            address,
            coverImage: "",
            name: info.name,
            description: info.description,
            platform: "",
            collectionUrl: null,
            nftUrl: null,
            tags: []
        }
    }
}

const queryNfts = async (collectionAddress) => {
    let info = await zdk.tokens({
        where: {
            collectionAddresses: [collectionAddress]
        },
        sort: {
            sortKey: "MINTED"
        },
        pagination: {
            limit: 100
        },
        nodes: {
            image: {
                url: true
            }
        }
    })
    console.log(info)
    // info.tokens.nodes.filter(nft => nft.owner !== "0x0000000000000000000000000000000000000000")
    return info.tokens.nodes.map(
        nft => ({
            name: nft.token.name || `#${nft.token.tokenId}`,
            tokenId: nft.token.tokenId,
            thumbnail: nft.token?.image?.mediaEncoding?.thumbnail,
            description: nft.token.description
        })
    )
}

const queryNftInfo = async (collectionAddress, nftId) => {
    const info = await zdk.token({
        token: {
            address: collectionAddress,
            tokenId: nftId,
        },
        includeFullDetails: true
    })
    console.log("NFT Singolo: ", info)
    return {
        name: info.token.token.name || `#${info.token.token.tokenId}`,
        description: info.token.token.description,
        url: info.token.token.image.mediaEncoding.poster,
        sales: info.token.sales.map(sale => ({
            buyer: sale.buyerAddress,
            seller: sale.sellerAddress,
            hash: sale.transactionInfo.transactionHash,
            timestamp: sale.transactionInfo.blockTimestamp,
            platform: sale.saleContractAddress,
            nativePrice: {
                amount: sale.price.nativePrice.decimal,
                currency: sale.price.nativePrice.currency.name
            },
            usdPrice: sale.price.usdcPrice.decimal
        }))
    }
}

const getCategories = () => {
    let totalCategories = []
    collections.forEach(collection => {
        const currentCategories = collection.tags || []
        currentCategories.forEach(category => totalCategories.push(category))
    })
    const unique = [...new Set(totalCategories)]
    return unique
}

export { addressToCollections, queryCollections, queryNfts, queryNftInfo, getCategories }