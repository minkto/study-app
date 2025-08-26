import { getResourceFromOpenAI, validateOpenAIPromptValue } from "@/services/openAIService";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const body = await request.json();

        const trimmedPrompt = body?.prompt?.trim();

        const validationResult = validateOpenAIPromptValue(trimmedPrompt);

        if (!validationResult.success) {
            return NextResponse.json(
                {
                    message: 'API Validation Error',
                    error: validationResult.error
                },
                { status: 400 }
            );
        }

        const response = await getResourceFromOpenAI(body.prompt);

        // TODO: Handle the Error responses from the service.
        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API Error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}