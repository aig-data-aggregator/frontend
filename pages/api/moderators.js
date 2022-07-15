import { getSession } from "next-auth/react"
import clientPromise from "../../common/mongodb"
/*import Joi from "joi"

const artistSchema = Joi.object({
    name: Joi.string().default(''),
    description: Joi.string().default(''),
    openSeaSlug: Joi.
})*/

async function postModerator(req, res, session, moderatorCollection) {
    const moderators = await moderatorCollection.find({}).toArray()
    if(moderators.some(e => e._id.toLowerCase() === session.address.toLowerCase())){
        try {
            const response = await moderatorCollection.update(
                {_id: req.body._id.toLowerCase()},
                {
                    $setOnInsert: {_id: req.body._id.toLowerCase()}
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
    else {
        res.status(401).send({ message: 'Unauthorized' })
    }
}

async function getModerators(req, res, moderatorCollection){
    try {
        const response = await moderatorCollection.find({}).toArray()
        res.status(200).json(response)
    } catch (e) {
        console.log('ERROR')
        console.log(e)
        res.status(500).json({error: e.message})
    }
}

export default async (req, res) => {
    const mongo = await clientPromise
    const moderatorCollection = mongo.db('dev').collection('moderators')
    const session = await getSession({ req })
    switch(req.method) {
        case 'POST':
            await postModerator(req, res, session, moderatorCollection)
        break;
        case 'GET':
            await getModerators(req, res, moderatorCollection)
        break;
        default:
            res.status(405).send({ message: 'Method not allowed' })
        break;
    }    
    
}
