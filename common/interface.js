import { ZDK, ZDKNetwork, ZDKChain } from "@zoralabs/zdk";
import { collections } from "./collections";
import { artists } from "./artists";
import { featured } from "./featured";
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
    const collections = await fetch('/api/collections').then(res=>res.json())
    return collections.map(collection => ({...collection, address: collection._id}))
}

const queryArtists = async () => {
    return artists
}

const addressToCollections = async (address) => {
    const collections = await queryCollections()
    if(collections.map(collection=>collection.address).includes(address)) {
        const matchingCollection = collections.filter(collection => collection.address === address)[0]

        if (matchingCollection.openseaSlug) {
            const openseaInfo = await queryOpenseaInfo(matchingCollection.openseaSlug)
            return {
                ...matchingCollection,
                ...openseaInfo
            }
        }
        return matchingCollection
    } else {
        // fallback da finire
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

const addressToArtist = async (address) => {
    const artists = await queryArtists()
    if(artists.map(artist=>artist.address).includes(address)) {
        const matchingArtist = artists.filter(artist => artist.address === address)[0]
        return matchingArtist
    } else {
        // fallback da finire
        return {
            address,
            coverImage: "",
            name: "",
            description: "",
            tags: []
        }
    }
}

const queryNfts = async (collectionAddress, hashPage) => {
    let options = {
        where: {
            collectionAddresses: [collectionAddress]
        },
        sort: {
            sortKey: "MINTED"
        },
        pagination: {
            limit: 50
        },
        nodes: {
            image: {
                url: true
            }
        }
    }
    if(hashPage){
        options.pagination = {
            after: hashPage
        }
    }
    let info = await zdk.tokens(options)
    return {
        nfts: info.tokens.nodes.map(
            nft => ({
                name: nft.token.name || `#${nft.token.tokenId}`,
                tokenId: nft.token.tokenId,
                thumbnail: nft.token?.image?.mediaEncoding?.poster,
                description: nft.token.description
            })
        ),
        hasNextPage: info.tokens.pageInfo.hasNextPage,
        nextPage: info.tokens.pageInfo.endCursor
    }
}

const queryNftInfo = async (collectionAddress, nftId) => {
    const info = await zdk.token({
        token: {
            address: collectionAddress,
            tokenId: nftId,
        },
        includeFullDetails: true
    })
    if (info.token.token.description === null || info.token.token.description === undefined) {
        // TODO: Query OpenSea/ethers, then do info.token.token.description = ...
    }

    return {
        name: info.token.token.name || `#${info.token.token.tokenId}`,
        description: info.token.token.description,
        owner: info.token.token.owner,
        minter: info.token.token.mintInfo?.originatorAddress,
        url: info.token.token?.image?.mediaEncoding?.large,
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

const queryOpenseaInfo = async (slug) => {
    const collectionInfo = await fetch('https://api.opensea.io/api/v1/collection/' + slug).then(res => res.json()).then(res => res.collection)
    return {
        name: collectionInfo.name,
        description: collectionInfo.description,
        shortDescription: collectionInfo.short_description,
        image: collectionInfo.image_url,
        banner: collectionInfo.banner_image_url,
        externalUrl: collectionInfo.external_url,
        stats: {
            day: {
                volume: collectionInfo.stats.one_day_volume,
                change: collectionInfo.stats.one_day_change,
                sales: collectionInfo.stats.one_day_sales,
                averagePrice: collectionInfo.stats.one_day_average_price
            },
            week: {
                volume: collectionInfo.stats.seven_day_volume,
                change: collectionInfo.stats.seven_day_change,
                sales: collectionInfo.stats.seven_day_sales,
                averagePrice: collectionInfo.stats.seven_day_average_price
            },
            month: {
                volume: collectionInfo.stats.thirty_day_volume,
                change: collectionInfo.stats.thirty_day_change,
                sales: collectionInfo.stats.thirty_day_sales,
                averagePrice: collectionInfo.stats.thirty_day_average_price
            },
            total: {
                volume: collectionInfo.stats.total_volume,
                sales: collectionInfo.stats.total_sales,
                averagePrice: collectionInfo.stats.total_average_price
            },
            floorPrice: collectionInfo.stats.floor_price,
            marketCap: collectionInfo.stats.market_cap,
            numOwners: collectionInfo.stats.num_owners,
            totalSupply: collectionInfo.stats.total_supply,
            count: collectionInfo.stats.count
        }
    }
}

const nftsMintedByAddress = async (address, hashPage) => {
    let options = {
        where: {
            minterAddresses: [address]
        },
        /*sort: {
            sortKey: "MINTED"
        },*/
        pagination: {
            limit: 50
        },
        nodes: {
            collectionAddress: true,
            
            image: {
                url: true
            }
        }
    }
    if(hashPage){
        options.pagination = {
            after: hashPage
        }
    }
    const mints = await zdk.mints(options)
    return {
        nfts: mints.mints.nodes.map(node => ({
            name: node.token.name || `#${node.token.tokenId}`,
            tokenId: node.token.tokenId,
            thumbnail: node.token?.image?.mediaEncoding?.poster,
            description: node.token.description,
            collectionAddress: node.token.collectionAddress
        })),
        hasNextPage: mints.mints.pageInfo.hasNextPage,
        nextPage: mints.mints.pageInfo.endCursor
    }
}


const nftsOwnedByAddress = async (address, hashPage) => {
    let options = {
        where: {
            ownerAddresses: [address]
        },
        sort: {
            sortKey: "MINTED"
        },
        pagination: {
            limit: 50
        },
        nodes: {
            image: {
                url: true
            }
        }
    }
    if(hashPage){
        options.pagination = {
            after: hashPage
        }
    }
    let info = await zdk.tokens(options)
    return {
        nfts: info.tokens.nodes.map(
            nft => ({
                name: nft.token.name || `#${nft.token.tokenId}`,
                tokenId: nft.token.tokenId,
                thumbnail: nft.token?.image?.mediaEncoding?.poster || nft.token?.image?.mediaEncoding?.original,
                description: nft.token.description,
                collectionAddress: nft.token.collectionAddress
            })
        ),
        hasNextPage: info.tokens.pageInfo.hasNextPage,
        nextPage: info.tokens.pageInfo.endCursor
    }
}

const queryFeatured = async () => {
    return featured
}

const queryTopCollections = async (period)=> {
    if(period)
        return await fetch(`https://api.cryptoslam.io/v1/collections/top-100?timeRange=${period}`).then(res => res.json())
    else return []
}

const queryModerators = async () => {
    const moderators = await fetch('/api/moderators').then(res => res.json())
    return moderators.map(moderator => ({
        address: moderator._id
    }))
}

const querySingleArtist = async (artistAddress) => {
    const artist = await fetch('/api/artists/'+artistAddress).then(res => res.json())
    return artist
}

export { addressToCollections, addressToArtist, 
            queryCollections, queryNfts, queryNftInfo, 
            getCategories, 
            nftsOwnedByAddress, nftsMintedByAddress, 
            queryArtists, queryFeatured,
            queryTopCollections,
            queryModerators,
            querySingleArtist
        }