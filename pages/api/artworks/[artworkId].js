import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"
import { ObjectId } from 'mongodb'

async function editArtwork(req, res, session, artworksCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if (!moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())) {
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await artworksCollection.findOneAndUpdate(
                {_id: new ObjectId(req.query.artworkId)},
                {
                    $set: {
                        ...req.body,
                        collectionAddress: req.body?.collectionAddress?.toLowerCase()
                    }
                }
            )
            res.status(200).json(response)
        } catch(e){
            console.log(e)
            res.status(500).json({error: e})
        }
    }
}

async function deleteArtwork(req, res, session, artworksCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await artworksCollection.findOneAndDelete(
                {_id: new ObjectId(req.query.artworkId)}
            )
            res.status(200).json(response)
        } catch(e){
            console.log(e)
            res.status(500).json({error: e})
        }
    }
}

export default async (req, res) => {
    const mongo = await clientPromise
    const artworksCollection = mongo.db('dev').collection('artworks')
    const session = await getSession({ req })
    switch(req.method) {
        case 'PUT':
            await editArtwork(req, res, session, artworksCollection)
        break;
        case 'DELETE':
            await deleteArtwork(req, res, session, artworksCollection)
        break;
    }
}