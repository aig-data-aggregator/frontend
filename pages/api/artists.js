import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"

async function postArtist(req, res, session, artistCollection) {
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(session?.address.toLowerCase() !== req.query.artistAddress.toLowerCase() && !moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await artistCollection.update(
                {_id: req.body.address.toLowerCase()},
                {
                    $setOnInsert: req.body
                },
                {upsert: true}
            )
            res.status(200).json(response)
        } catch (e) {
            console.log('ERROR')
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

async function getArtist(req, res, artistCollection){
    try {
        const response = await artistCollection.find({}).toArray()
        res.status(200).json(response)
    } catch (e) {
        console.log('ERROR')
        console.log(e)
        res.status(500).json({error: e.message})
    }
}

export default async (req, res) => {
    const mongo = await clientPromise
    const artistCollection = mongo.db('dev').collection('artists')
    const session = await getSession({ req })
    switch(req.method) {
        case 'POST':
            await postArtist(req, res, session, artistCollection)
        break;
        case 'GET':
            await getArtist(req, res, artistCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}