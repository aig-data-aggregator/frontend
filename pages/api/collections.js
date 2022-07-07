import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"

async function postCollection(req, res, session, collectionsCollection) {
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(session?.address !== req.query.artistAddress && !moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await collectionsCollection.update(
                {_id: req.body._id},
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

async function getCollections(req, res, collectionsCollection){
    try {
        const response = await collectionsCollection.find({}).toArray()
        res.status(200).json(response)
    } catch (e) {
        console.log('ERROR')
        console.log(e)
        res.status(500).json({error: e.message})
    }
}


export default async (req, res) => {
    const mongo = await clientPromise
    const collectionsCollection = mongo.db('dev').collection('collections')
    const session = await getSession({ req })
    switch(req.method) {
        case 'POST':
            await postCollection(req, res, session, collectionsCollection)
        break;
        case 'GET':
            await getCollections(req, res, collectionsCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}