import { ChatOpenAI } from "@langchain/openai"
import { MemorySaver } from "@langchain/langgraph"
import { createAgent, tool } from "langchain"
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

const getUser = tool(
    async (_, runtime) => {
        return `Current user: ${runtime.context.userId}`
    },
    {
        name: "get_user",
        description: "Gets the current user's ID.",
        schema: z.object({}),
    },
)

const checkpointer = new MemorySaver()

const responseSchema = z.object({
    answer: z.string(),
    usedCalculator: z.boolean(),
})

const contextSchema = z.object({
    userId: z.string(),
})

export const agent = createAgent({
    model,
    tools: [calculator, getUser],
    systemPrompt:
        "You are a helpful assistant. Use the tools at your disposal.",
    checkpointer,
    responseFormat: responseSchema,
    contextSchema,
})

export async function POST(request: Request) {
    const { message } = await request.json()

    const result = await agent.invoke(
        {
            messages: [
                {
                    role: "user",
                    content: message,
                },
            ],
        },
        {
            configurable: {
                thread_id: "user-123",
            },
            context: {
                userId: "user-123",
            },
        },
    )

    const lastMessage = result.messages.at(-1)

    console.log("🚀 ~ POST ~ result:", result)
    console.log("🚀 ~ lastMessage:", lastMessage)

    return NextResponse.json(
        {
            data: result.structuredResponse,
        },
        { status: 200 },
    )
}
