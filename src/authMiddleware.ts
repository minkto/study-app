import { ClerkMiddlewareAuth, createRouteMatcher } from "@clerk/nextjs/server";
import { NextRequest } from "next/server";

const isPublicRoute = createRouteMatcher(['/api/webhooks/clerk/users', '/auth/sign-in(.*)', '/auth/sign-up(.*)'])

export async function authMiddleware(auth: ClerkMiddlewareAuth, req: NextRequest) {

    if (!isPublicRoute(req)) {
        await auth.protect()
    }
}
