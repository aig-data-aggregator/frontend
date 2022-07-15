import { getSession } from "next-auth/react"
import clientPromise from "../../../common/mongodb"
import { ObjectId } from 'mongodb'

async function editNews(req, res, session, newsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if (!moderators.find(moderator => moderator._id.toLowerCase() === session.address.toLowerCase())) {
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await newsCollection.findOneAndUpdate(
                {_id: new ObjectId(req.query.newsId)},
                {
                    $set: req.body
                }
            )
            res.status(200).json(response)
        } catch(e){
            console.log(e)
            res.status(500).json({error: e})
        }
    }
}

async function deleteNews(req, res, session, newsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try{
            const response = await newsCollection.findOneAndDelete(
                {_id: new ObjectId(req.query.newsId)}
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
    const newsCollection = mongo.db('dev').collection('news')
    const session = await getSession({ req })
    switch(req.method) {
        case 'PUT':
            await editNews(req, res, session, newsCollection)
        break;
        case 'DELETE':
            await deleteNews(req, res, session, newsCollection)
        break;
    }
}