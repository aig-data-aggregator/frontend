import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"


async function getArtist(req, res, artistCollection){
    const response = await artistCollection.findOne({_id: req.query.artistAddress.toLowerCase()})
    res.status(200).json(response)
}

async function modifyArtist(req, res, session, artistCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    console.log(req.query)
    if(session?.address.toLowerCase() !== req.query.artistAddress.toLowerCase() && !moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        console.log('Updating!')
        try {
            if(req.body.address.toLowerCase() !== req.query.artistAddress.toLowerCase()){
                // address changed
                let oldArtist = await artistCollection.findOne({_id: req.query.artistAddress.toLowerCase()})
                oldArtist._id = req.body.address.toLowerCase()
                await artistCollection.insertOne(oldArtist)
                const response = await artistCollection.deleteOne({_id: req.query.artistAddress.toLowerCase()})
                res.status(200).json(response)
            }
            else {
                const response = await artistCollection.findOneAndUpdate(
                    {_id: req.query.artistAddress.toLowerCase()},
                    {
                        $set: req.body
                    }, {upsert: true}
                )
                res.status(200).json(response)
            }
        } catch (e) {
            console.log('ERROR')
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

async function deleteArtist(req, res, session, artistCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await artistCollection.findOneAndDelete(
                {_id: req.query.artistAddress.toLowerCase()}
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
    const artistCollection = mongo.db('dev').collection('artists')
    const session = await getSession({ req })
    switch(req.method) {
        case 'GET':
            await getArtist(req, res, artistCollection)
        break;
        case 'PUT':
            await modifyArtist(req, res,session, artistCollection)
        break;
        case 'DELETE':
            await deleteArtist(req, res, session, artistCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
    
}
