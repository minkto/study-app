import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";
import { NextRequest, NextResponse } from "next/server";

export const rateLimitMiddleware = async (req: NextRequest) => {
    const ratelimit = new Ratelimit({
        redis: Redis.fromEnv(),
        limiter: Ratelimit.fixedWindow(5, "10s"),
    });

    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success, limit, reset, remaining } = await ratelimit.limit(ip);
    if (!success) {
        return getRateLimitResponse(limit,remaining,reset);
    }
}


const getRateLimitResponse = (limit: number, remaining: number, reset: number) => {
    return new NextResponse("Too Many Requests", {
        status: 429,
        headers: {
            "X-RateLimit-Limit": limit.toString(),
            "X-RateLimit-Remaining": remaining.toString(),
            "X-RateLimit-Reset": reset.toString(),
        },
    });
}

export default rateLimitMiddleware;