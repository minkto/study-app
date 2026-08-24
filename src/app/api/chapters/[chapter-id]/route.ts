import { deleteChapter } from "@/db/chapters/deleteChapter";
import { getChapter } from "@/db/chapters/getChapter";
import { updateChapter } from "@/db/chapters/updateChapter";
import { validateChapter } from "@/services/validateChaptersService";
import { AppUser, Chapter } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) => {

    const slug = (await params);
    const chapterIdNum = Number(slug["chapter-id"]);
    const chapter = await getChapter(chapterIdNum, currentUser.userId);

    if (chapter === null || chapter === undefined) {
        return NextResponse.json({ message: "Could not find chapter." }, { status: 404 });
    }

    return NextResponse.json(chapter, { status: 200 });
});

export const PUT = withApiErrorHandling(async (currentUser: AppUser, request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) => {

    const res = await request.json();
    const slug = (await params);
    const chapterIdNum = Number(slug["chapter-id"]);

    const chapterFromDb = await getChapter(chapterIdNum, currentUser.userId);

    if (chapterFromDb === undefined ||
        chapterFromDb === null) {
        return NextResponse.json({ message: "No Chapter was found." }, { status: 404 });
    }

    const chapter: Chapter =
    {
        chapterId: chapterIdNum,
        resourceId: res["resourceId"],
        name: res["name"],
        description: res["description"],
        statusId: res["statusId"],
        url: res["url"],
        lastDateCompleted: res["lastDateCompleted"],
        originalDateCompleted: res["originalDateCompleted"]
    }

    const validationModel = validateChapter(chapter);
    if (!validationModel.isValid) {
        return NextResponse.json({ message: validationModel.message }, { status: 400 });
    }

    const result = await updateChapter(chapter);

    return NextResponse.json(result, { status: 200 });
});


export const DELETE = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) => {

    const slug = (await params);
    const chapterIdNum = Number(slug["chapter-id"]);

    const chapterFromDb = await getChapter(chapterIdNum, currentUser.userId);

    if (chapterFromDb === undefined ||
        chapterFromDb === null) {
        return NextResponse.json({ message: "No Chapter was found." }, { status: 404 });
    }

    const result = await deleteChapter(chapterIdNum);

    return NextResponse.json(result, { status: 200 });
});
