import { createAgent } from "langchain"

import "dotenv"
import { ChatOpenAI } from "@langchain/openai"
import { NextResponse } from "next/server"

const model = new ChatOpenAI({
    model: "gpt-5-mini",
})

export const agent = createAgent({
    model,
    tools: [],
})

export async function POST(request: Request) {
    const { message } = await request.json()

    const result = await agent.invoke({
        messages: [
            {
                role: "user",
                content: message,
            },
        ],
    })

    const lastMessage = result.messages.at(-1)

    console.log("🚀 ~ POST ~ result:", result)
    console.log("🚀 ~ lastMessage:", lastMessage)

    return NextResponse.json(
        {
            data: lastMessage?.content,
        },
        { status: 200 },
    )
}
