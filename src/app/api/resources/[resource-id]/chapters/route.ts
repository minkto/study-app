import { createChapter } from "@/db/chapters/createChapter";
import { deleteChapter } from "@/db/chapters/deleteChapter";
import { getChapter } from "@/db/chapters/getChapter";
import { getChaptersByResourceId } from "@/db/chapters/getChapterByResourceId";
import { updateChapter } from "@/db/chapters/updateChapter";
import { Chapter } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET(request: Request, { params }: { params: Promise<{ "resource-id": number }> }) {
    try {
        const slug = (await params);

        const chapters = await getChaptersByResourceId(slug["resource-id"]);

        return NextResponse.json(chapters, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const res = await request.json();

        const chapterFromDb = await getChapter(res["chapterId"]);

        if (chapterFromDb === undefined ||
            chapterFromDb === null) {
            return NextResponse.json({ message: "No resource was found." }, { status: 404 });
        }

        const chapter: Chapter =
        {
            resourceId: res["resourceId"],
            name: res["name"],
            chapterId: res["chapterId"],
            statusId: res["statusId"],
            url: res["url"],
            lastDateCompleted: res["lastDateCompleted"],
            originalDateCompleted: res["originalDateCompleted"]
        }


        const result = await updateChapter(chapter);

        return NextResponse.json(result, { status: 200 });

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
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }

}

export async function DELETE(request: Request) {
    try {
        const res = await request.json();
        const result = await deleteChapter(res["chapterId"]);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }

}