import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatMistralAI } from "@langchain/mistralai";
import {HumanMessage,SystemMessage,AIMessage,tool,createAgent} from 'langchain'
import * as z from "zod"
import { searchInternet } from "./internet.service.js";

const geminimodel = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite",
  apiKey: process.env.GEMINI_API_KEY
});
const mistralmodel= new ChatMistralAI({
  apiKey: process.env.MISTRAL_API_KEY,
  modelName: "mistral-small-latest",
});
const searchInternetTool=tool(
  searchInternet,
  {
    name:"searchInternet",
    description:"use this tool to get latest information from internet",
    schema:z.object({
      query:z.string().describe("The Search query to look up on the internet.")
    })
  }
)
const agent=createAgent({
  model:mistralmodel,
  tools:[searchInternetTool],
//   prompt: `You are a helpful AI assistant.
// For any query about latest news, current events, recent updates, today's information, yesterday's information, live information, or anything time-sensitive, you must use the searchInternet tool before answering.
// Do not answer time-sensitive questions from old memory.
// After using the tool, answer based on the tool result.`
})
// export async function testai(){
//     geminimodel.invoke("what is the capital of france")
//     .then((response)=>{
//         console.log(response.text)
//     })
// }
export async function generatemessage(messages){
    const today = new Date().toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })
    const formattedMessages = 
    [new SystemMessage(`You are a helpful AI assistant. Today is ${today}. For latest news, current affairs, recent updates, live information, or any time-sensitive question, you must use the searchInternet tool before answering. When calling the tool for time-sensitive queries, include "today" or the current date in the search query. Do not answer time-sensitive questions from old memory.`),
    ...messages.map((msg) => {
        if (msg.role === 'user') {
          return new HumanMessage(msg.content)
        } else if (msg.role === 'ai'||msg.role==='assistant') {
          return new AIMessage(msg.content)
        }
        return null
      })
      .filter(Boolean)
    ]

    try {
      const response = await agent.invoke({messages:formattedMessages})
      return response.messages[response.messages.length-1].text
    } catch (error) {
      console.warn("Gemini response generation failed, falling back to Mistral:", error.message)
      const fallbackResponse = await mistralmodel.invoke(formattedMessages)
      return fallbackResponse.text
    }
}

export async function generatechatTitle(message){
  const response=await mistralmodel.invoke([
  new SystemMessage(`you are a helpful assistant that generates concise and descriptive titles for chat conversations.
    
  user will provide you first message of the conversation and you will generate a title for the conversation based on that message. The title should be concise, descriptive, and relevant to the content of the first message. Do not include any additional information or context in the title, just focus on creating a clear and informative title based on the first message provided by the user and title should be 2-3 words.


    `),
    new HumanMessage(`
      Generate a title for the following first message of a chat conversation:
      
     " ${message}"
     `)
  ])
  return response.text
  
}
