import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"
import { ObjectId } from 'mongodb'

async function editEvent(req, res, session, eventsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if (!moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())) {
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await eventsCollection.findOneAndUpdate(
                {_id: new ObjectId(req.query.eventId)},
                {
                    $set: {
                        ...req.body,
                        artists: req.body.artists.map(address => address.toLowerCase())
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

async function deleteEvents(req, res, session, eventsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await eventsCollection.findOneAndDelete(
                {_id: new ObjectId(req.query.eventId)}
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
    const eventsCollection = mongo.db('dev').collection('events')
    const session = await getSession({ req })
    switch(req.method) {
        case 'PUT':
            await editEvent(req, res, session, eventsCollection)
        break;
        case 'DELETE':
            await deleteEvents(req, res, session, eventsCollection)
        break;
    }
}