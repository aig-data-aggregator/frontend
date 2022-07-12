import ogs from "open-graph-scraper"

const queryOgFields = async function(url) {
    const options = { url }
    const data = await ogs(options)
    const result = data.result
    console.log(result)
    return {
        title: result?.ogTitle,
        description: result?.ogDescription,
        imageUrl: result?.ogImage?.url,
        date: result?.articlePublishedTime
    }
}

export default async (req, res) => {
    switch(req.method) {
        case 'GET':
            const response = await queryOgFields(decodeURI(req.query.url))
            res.status(200).json(response)
        break
    }
}