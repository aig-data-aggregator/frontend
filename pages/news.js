import React, {useState, useEffect } from "react"
import { queryNews } from "../common/interface"
import NewsCard from "../components/NewsCard"

export default function News() {
    const [news, setNews] = useState(null)

    useEffect(() => {
        queryNews().then(newNews => setNews(newNews.sort((a, b) => b.date - a.date)))
    }, [])

    return (
        <div>
            <div style={{height:"300px"}}></div>
                {news && news.map(newsItem => (
                    <NewsCard key={newsItem.url} date={newsItem.date} url={newsItem.url} tags={newsItem.tags} />    
                ))}
        </div>
    )
}