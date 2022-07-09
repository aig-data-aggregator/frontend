import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"


async function deleteModerator(req, res, session, moderatorCollection) {
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await moderatorCollection.findOneAndDelete(
                {_id: req.query.moderatorAddress}
            )
            res.status(200).json(response)
        } catch (e) {
            console.log('ERROR')
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

async function editModerator(req, res, session, moderatorCollection) {
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            if(req.body.address !== req.query.moderatorAddress){
                let oldModerator = await moderatorCollection.findOne({_id: req.query.moderatorAddress})
                oldModerator._id = req.body.address
                await moderatorCollection.deleteOne({_id: req.query.moderatorAddress})
                const response = await moderatorCollection.insertOne(oldModerator)
                res.status(200).json(response)
            } else {
                const response = await moderatorCollection.findOneAndUpdate(
                    {_id: req.query.artistAddress},
                    {
                        $set: req.body
                    }
                )
                res.status(200).json(response)
            }
        } catch(e){
            console.log('ERROR')
            console.log(e)
            res.status(500).json({error: e.message})
        }
    }
}

export default async (req, res) => {
    const mongo = await clientPromise
    const moderatorCollection = mongo.db('dev').collection('moderators')
    const session = await getSession({ req })
    switch(req.method) {
        case 'DELETE':
            await deleteModerator(req, res, session, moderatorCollection)
        break;
        case 'PUT':
            await editModerator(req, res, session, moderatorCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }    
}