import { NextResponse } from "next/server";
import { createApiErrorResponse } from "./errors";
import { AppUser } from "@/shared.types";
import { getCurrentAppUser } from "@/services/auth/userService";

export function withApiErrorHandling<Args extends unknown[]>(
    handler: (userId: AppUser, ...args: Args) => Promise<Response>
) {
    return async (...args: Args): Promise<Response> => {
        try {
            const currentUser = await getCurrentAppUser();

            if (!currentUser) {
                return new Response(
                    JSON.stringify({ error: "Unauthorized" }),
                    { status: 401 }
                );
            }

            return await handler(currentUser, ...args);
        } catch (error) {
            const { errorMessage, status } = createApiErrorResponse(error);
            return NextResponse.json({ message: errorMessage }, { status });
        }
    };
}
