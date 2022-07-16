import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"

async function getEvents(req, res, session, eventsCollection){
    try{
        const events = await eventsCollection.find({}).toArray()
        res.status(200).json(events)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

async function postEvents(req, res, session, eventsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await eventsCollection.insertOne(
                req.body
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
    const eventsCollection = mongo.db('dev').collection('events')
    const session = await getSession({ req })
    switch(req.method) {
        case 'GET':
            await getEvents(req, res, session, eventsCollection)
        break;
        case 'POST':
            await postEvents(req, res, session, eventsCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}