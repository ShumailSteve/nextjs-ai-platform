import { auth } from "@clerk/nextjs";
import { NextResponse } from "next/server";
import OpenAI from "openai"

const configuration = {
    key: process.env.OPENAI_API_KEY,
}

const openai = new OpenAI({
    apiKey: configuration.key
})

export async function POST(req: Request) {
    try {
        const { userId } = auth()
        const body = await req.json()
        const { messages } = body

        if(!userId) {
            return new NextResponse("Unauthorized", { status:  401 })
        }

        if(!configuration.key) {
            return new NextResponse("OpenAI API Key not configured", { status:  500 })
        }
        
        if(!messages) {
            return new NextResponse("Messages are required", { status:  400 })
        }

        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages,
        });

        return NextResponse.json(response.choices[0].message);

    } catch (err) {
        console.log("Conversion_ERROR: ", err)
        return new NextResponse("Internal server  error", { status: 500 })

    }
}

