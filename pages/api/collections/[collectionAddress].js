import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"

async function modifyCollection(req, res, collectionsCollection, session){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(session?.address !== req.query.artistAddress && !moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            console.log(req.body)
            const actualBody = {...req.body}
            // actualBody._id = actualBody.address
            delete actualBody.address
            const response = await collectionsCollection.findOneAndUpdate(
                {_id: req.body.address},
                {
                    $set: actualBody
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
    const collectionsCollection = mongo.db('dev').collection('collections')
    const session = await getSession({ req })
    switch(req.method) {
        case 'PUT':
            await modifyCollection(req, res, collectionsCollection, session)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}