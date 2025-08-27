import { getResourceFromOpenAI, validateOpenAIPromptValue } from "@/services/openAIService";
import { createApiErrorResponse } from "@/utils/errors";
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

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                resources: [],
                error: createApiErrorResponse(error)
            }, { status: 500 });
    }
}