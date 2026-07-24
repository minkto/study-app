import { NextFetchEvent, NextRequest } from "next/server";
import rateLimitMiddleware from './rateLimitMiddleware';
import { clerkMiddleware } from "@clerk/nextjs/server";
import { authMiddleware } from "./authMiddleware";


export default async function middleware(req: NextRequest, event: NextFetchEvent) {
  const rateLimited = await rateLimitMiddleware(req);
  if (rateLimited) {
    return rateLimited;
  }
  return await clerkMiddleware(authMiddleware)(req, event)
}

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
}