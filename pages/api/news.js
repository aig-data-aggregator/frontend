import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"

async function getNews(req, res, session, newsCollection){
    try{
        const news = await newsCollection.find({}).toArray()
        res.status(200).json(news)
    }
    catch(err){
        console.log(err)
        res.status(500).send(err)
    }
}

async function postNews(req, res, session, newsCollection){
    const moderatorCollection = (await clientPromise).db('dev').collection('moderators')
    const moderators = await moderatorCollection.find({}).toArray()
    if(!moderators.find(moderator => moderator._id === session.address)){
        res.status(401).json({error:"Unauthorized"})
    }
    else {
        try {
            const response = await newsCollection.insertOne(
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
    const newsCollection = mongo.db('dev').collection('news')
    const session = await getSession({ req })
    switch(req.method) {
        case 'GET':
            await getNews(req, res, session, newsCollection)
        break;
        case 'POST':
            await postNews(req, res, session, newsCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }
}