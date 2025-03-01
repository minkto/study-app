import { createChapter } from "@/db/chapters/createChapter";
import { getChapter } from "@/db/chapters/getChapter";
import { Chapter } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ "resource-id": number }> }) {
    try {

        const slug = (await params);

        const chapters = await getChapter(slug["resource-id"]);

        return NextResponse.json(chapters, { status: 200 })

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}


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
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }

}