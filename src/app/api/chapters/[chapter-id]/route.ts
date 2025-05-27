import { deleteChapter } from "@/db/chapters/deleteChapter";
import { getChapter } from "@/db/chapters/getChapter";
import { updateChapter } from "@/db/chapters/updateChapter";
import { validateChapter } from "@/services/validateChaptersService";
import { Chapter } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "chapter-id": number }> }) {
    try {
        const slug = (await params);
        const chapter = await getChapter(slug["chapter-id"]);

        if(chapter === null || chapter === undefined)
        {
            return NextResponse.json({message: "Could not find chapter."}, { status: 404 });
        }

        return NextResponse.json(chapter, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ "chapter-id": number }> }) {
    try {
        const res = await request.json();
        const slug = (await params);
        const chapterFromDb = await getChapter(slug["chapter-id"]);

        if (chapterFromDb === undefined ||
            chapterFromDb === null) {
            return NextResponse.json({ message: "No resource was found." }, { status: 404 });
        }

        const chapter: Chapter =
        {
            chapterId: slug["chapter-id"],
            resourceId: res["resourceId"],
            name: res["name"],
            statusId: res["statusId"],
            url: res["url"],
            lastDateCompleted: res["lastDateCompleted"],
            originalDateCompleted: res["originalDateCompleted"]
        }

        const validationModel = validateChapter(chapter);
        if(!validationModel.isValid)
        {
            return NextResponse.json({message: validationModel.message}, { status: 400 });
        }

        const result = await updateChapter(chapter);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}


export async function DELETE(_request: Request, { params }: { params: Promise<{ "chapter-id": number }> }) {
    try {
        const slug = (await params);
        const result = await deleteChapter(slug["chapter-id"]);

        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }

}