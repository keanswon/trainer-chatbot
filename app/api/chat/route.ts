import { OpenAI } from "openai/client.js";
import { NextResponse } from "next/server";
import { ChatCompletionMessageParam } from "openai/resources.js";

const apiKey = process.env.OPENAI_SECRET_KEY;

const SYSTEM_PROMPT = `
You are a personal trainer whose sole job is to give strength-training, conditioning, and nutrition advice
according to the following philosophy:
• Focus on strength training with a mix of hypertrophy and powerlifting principles
• Emphasize compound lifts (squats, deadlifts, bench press, pull ups / weighted pull ups)
• Include accessory work for muscle balance and injury prevention
• Tailor programs to individual goals (strength, hypertrophy, endurance)
• Use periodization and progressive overload principles
• Prioritize form and technique over weight lifted
• Provide sensible nutrition advice (macros, meal timing, hydration)
• Avoid fad diets or extreme caloric deficits
• Emphasize progressive overload and proper form  
• Prioritize recovery (sleep, nutrition, mobility)  
• Focus on whole-food macros, balanced meals, and sensible supplementation  
• Always tailor recommendations to individual goals, injury history, and lifestyle  
Stay strictly on topic: health, fitness, training, and nutrition.  Do not drift into unrelated subjects.
`.trim()

// Validate API key exists
if (!apiKey) {
    console.error("OPENAI_SECRET_KEY environment variable is not set");
}

const openai = new OpenAI({
    apiKey: apiKey,
});

// Type for message validation
interface ChatMessage {
    role: 'system' | 'user' | 'assistant';
    content: string;
}

function isValidMessage(msg: any): msg is ChatMessage {
    return (
        msg &&
        typeof msg === 'object' &&
        typeof msg.role === 'string' &&
        ['system', 'user', 'assistant'].includes(msg.role) &&
        typeof msg.content === 'string' &&
        msg.content.trim().length > 0
    );
}

export async function POST(request: Request) {
    try {
        // Check if API key is available
        if (!apiKey) {
            return NextResponse.json(
                { error: "OpenAI API key not configured" }, 
                { status: 500 }
            );
        }

        const { messages } = await request.json();

        // Validate messages format
        if (!messages || !Array.isArray(messages)) {
            console.log("Invalid messages format:", messages);
            return NextResponse.json(
                { error: "Invalid messages format. Expected an array." }, 
                { status: 400 }
            );
        }

        if (messages.length === 0) {
            console.log("Messages cannot be empty", messages);
            return NextResponse.json(
                { error: "Messages array cannot be empty" }, 
                { status: 400 }
            );
        }

        // Validate each message
        const validMessages = messages.filter(isValidMessage);

        // Limit message count to prevent abuse
        if (messages.length > 35) {
            console.log("Too many messages:", messages.length);
            return NextResponse.json(
                { error: "Too many messages. Maximum 35 messages allowed." }, 
                { status: 400 }
            );
        }

        const chatPayload: ChatCompletionMessageParam[] = [
            { 
                role: "system", 
                content: SYSTEM_PROMPT 
            },
            ...validMessages.map(msg => ({
                role: msg.role as "user" | "assistant" | "system",
                content: msg.content.trim()
            }))
        ];

        console.log("Sending request to OpenAI with messages:", validMessages);
        const completion = await openai.chat.completions.create({
            model: "gpt-4o-mini",
            messages: chatPayload,
            temperature: 0.7,
            max_tokens: 4000,
        });
        
        console.log("OpenAI response:", completion);

        const result = completion.choices[0].message.content;

        return NextResponse.json({ completion: result}, { status: 200 });

    } catch (error) {
        console.error("OpenAI API Error:", error);
        
        // Handle specific OpenAI errors
        if (error instanceof Error) {
            if (error.message.includes('API key')) {
                return NextResponse.json(
                    { error: "Invalid API key" }, 
                    { status: 401 }
                );
            }
            if (error.message.includes('rate limit')) {
                return NextResponse.json(
                    { error: "Rate limit exceeded. Please try again later." }, 
                    { status: 429 }
                );
            }
        }

        return NextResponse.json(
            { error: "Failed to process request" }, 
            { status: 500 }
        );
    }
}