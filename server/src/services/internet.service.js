import {tavily as Tavily} from "@tavily/core"

const tvly=Tavily({     
    apiKey:process.env.TAVILY_API_KEY
})

function isTimeSensitiveQuery(query) {
    return /(latest|current|today|breaking|recent|news|headline|update|live)/i.test(query)
}

function removeExplicitDates(query) {
    return query
        .replace(/\b(january|february|march|april|may|june|july|august|september|october|november|december)\b/gi, "")
        .replace(/\b(20\d{2}|19\d{2})\b/g, "")
        .replace(/\b\d{1,2}[/-]\d{1,2}([/-]\d{2,4})?\b/g, "")
        .replace(/\s+/g, " ")
        .trim()
}

export const searchInternet=async({query})=>{
    const today = new Date().toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
    })

    const useFreshNewsSearch = isTimeSensitiveQuery(query)
    const cleanedQuery = useFreshNewsSearch ? removeExplicitDates(query) : query
    const normalizedQuery = useFreshNewsSearch
        ? `${cleanedQuery} latest news today ${today}`
        : cleanedQuery

    console.log("searchInternet called with:", normalizedQuery)

    const results=await tvly.search(normalizedQuery,{
        maxResults: useFreshNewsSearch ? 10 : 5,
        searchDepth:"advanced",
        topic: useFreshNewsSearch ? "news" : "general",
        days: useFreshNewsSearch ? 7 : undefined,
        includeAnswer: useFreshNewsSearch ? "advanced" : false,
    })
    return JSON.stringify(results)
}
