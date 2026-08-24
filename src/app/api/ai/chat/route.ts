import { getResourceFromAIService, validateOpenAIPromptValue } from "@/services/openAIService";
import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { createApiErrorResponse } from "@/utils/errors";
import { NextResponse } from "next/server";

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {
    try {

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
});
