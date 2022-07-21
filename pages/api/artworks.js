import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"

async function getArtworks(req, res, session, artworksCollection){
    try{
        const artworks = await artworksCollection.find({}).toArray()
        res.status(200).json(artworks)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

async function postArtwork(req, res, session, artworksCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await artworksCollection.insertOne(
                {
                    ...req.body,
                    collectionAddress: req.body?.collectionAddress?.toLowerCase()
                }
            )
            res.status(200).json(response)
        } catch (e) {
            console.log('ERROR')
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

export default async (req, res) => {
    const mongo = await clientPromise
    const artworksCollection = mongo.db('dev').collection('artworks')
    const session = await getSession({ req })
    switch(req.method) {
        case 'GET':
            await getArtworks(req, res, session, artworksCollection)
        break;
        case 'POST':
            await postArtwork(req, res, session, artworksCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}