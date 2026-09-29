import { createAgent, tool } from "langchain"
import { ChatOpenAI } from "@langchain/openai"
import { NextResponse } from "next/server"
import z from "zod"
import "dotenv"

const model = new ChatOpenAI({
    model: "gpt-5-mini",
})

const calculator = tool(
    async ({ a, b }) => {
        return a + b
    },
    {
        name: "calculator",
        description: "Adds two numbers together.",
        schema: z.object({
            a: z.number().describe("The first number"),
            b: z.number().describe("The second number"),
        }),
    },
)

export const agent = createAgent({
    model,
    tools: [calculator],
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
