import { getChapter } from "@/db/chapters/getChapter";
import createNote from "@/db/chapters/notes/createNote";
import getNoteCount from "@/db/chapters/notes/getNoteCount";
import getNotes from "@/db/chapters/notes/getNotes";
import validateNote from "@/services/validateNoteService";
import { AppUser, Note } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) => {

    const res = await request.json();
    const idSlug = (await params);

    const note: Note =
    {
        chapterId: Number(idSlug["chapter-id"]),
        content: res["content"]
    }

    const chapter = await getChapter(Number(note.chapterId), currentUser.userId);
    if (!chapter) {
        return NextResponse.json({ message: "Could not find the chapter." }, { status: 404 });
    }

    const MAX_NOTES = 3;
    const notesCount = await getNoteCount(chapter.chapterId);

    if (notesCount >= MAX_NOTES) {
        return NextResponse.json({ message: `Cannot create more than ${MAX_NOTES} notes per chapter.` }, { status: 400 });
    }
    const validationResult = validateNote(note);
    if (!validationResult.isValid) {
        return NextResponse.json({ message: validationResult.message }, { status: 400 });
    }

    const response = await createNote(note);
    if (!response) {
        return NextResponse.json({ message: "Could not create note." }, { status: 400 });
    }

    return NextResponse.json(response, { status: 200 });
});

export const GET = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) => {

    const slugs = await params;

    const notes = await getNotes(Number(slugs["chapter-id"]), currentUser.userId);

    if (!notes) {
        return NextResponse.json({ message: "Could not find any notes." }, { status: 404 });
    }

    return NextResponse.json(notes, { status: 200 });
});
