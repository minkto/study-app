import { createChapter } from "@/db/chapters/createChapter";
import { Chapter } from "@/shared.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    
    try {
        const res = await request.json();
        const chapter: Chapter =
        {
            name: res["name"],
            chapterId: res["chapterId"],
            resourceId: res["resourceId"],
            statusId: res["statusId"],
            url: res["url"]
        };

        const result = await createChapter(chapter);
        return NextResponse.json(result, { status: 200 })

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: 'Database error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }

}