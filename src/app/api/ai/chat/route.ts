import { getCurrentAppUser } from "@/services/auth/userService";
import { getResourceFromAIService, validateOpenAIPromptValue } from "@/services/openAIService";
import { createApiErrorResponse } from "@/utils/errors";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {

        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
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

        const response = await getResourceFromAIService(trimmedPrompt);

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        return NextResponse.json(
            {
                resources: [],
                error: createApiErrorResponse(error)
            }, { status: 500 });
    }
}