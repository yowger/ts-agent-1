import { createAgent } from "langchain"

import "dotenv"
import { ChatOpenAI } from "@langchain/openai"

const model = new ChatOpenAI({
    model: "gpt-5-mini",
})

export const agent = createAgent({
    model,
    tools: [],
})

export async function POST(request: Request) {
    const message = "What are you?"

    const result = await agent.invoke({
        messages: [
            {
                role: "human",
                content: message,
            },
        ],
    })

    console.log("🚀 ~ POST ~ result:", result)
}
