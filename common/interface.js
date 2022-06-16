import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
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
    return [{
        "address": "0xbc4ca0eda7647a8ab7c2061c2e118a18a936f13d",
        "coverImage": "",
        "name": "Bored Ape Yacht Club",
        "description": "The Bored Ape Yacht Club is a collection of 10,000 unique Bored Ape NFTs— unique digital collectibles living on the Ethereum blockchain. Your Bored Ape doubles as your Yacht Club membership card, and grants access to members-only benefits, the first of which is access to THE BATHROOM, a collaborative graffiti board. Future areas and perks can be unlocked by the community through roadmap activation. Visit www.BoredApeYachtClub.com for more details."
    }]
}

const addressToCollections = async (address) => {
    const collections = await queryCollections()
    return collections.filter(collection => collection.address === address)[0]
}

const queryNfts = async (collectionAddress) => {
    const info = await zdk.tokens({
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

    return info.tokens.nodes.map(
        nft => ({
            name: nft.token.name || `#${nft.token.tokenId}`,
            tokenId: nft.token.tokenId,
            thumbnail: nft.token.image.mediaEncoding.thumbnail,
            description: nft.token.description
        })
    )
}

const queryNftInfo = async (collectionAddress, nftId) => {
    const info = await zdk.token({
        token: {
            address: collectionAddress,
            tokenId: nftId
        }
    })
    console.log("NFT Singolo: ", info)
    return {
        name: info.token.token.name || `#${info.token.token.tokenId}`,
        description: info.token.token.description,
        url: info.token.token.image.mediaEncoding.poster
    }
}

export { addressToCollections, queryCollections, queryNfts, queryNftInfo }