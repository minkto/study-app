import { getChapterStatuses } from "@/db/chapters/statuses/getChapterStatuses";
import { NextResponse } from "next/server";

export async function GET() {
    try {
        const result = await getChapterStatuses();
        return NextResponse.json(result, { status: 200 })
    }
    catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}