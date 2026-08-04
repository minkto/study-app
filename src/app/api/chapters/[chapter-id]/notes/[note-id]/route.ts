import deleteNote from "@/db/chapters/notes/deleteNote";
import { getNote } from "@/db/chapters/notes/getNote";
import updateNote from "@/db/chapters/notes/updateNote";
import { getCurrentAppUser } from "@/services/auth/userService";
import validateNote from "@/services/validateNoteService";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "chapter-id": string, "note-id": string }> }) {

    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

        const idSlugs = (await params);
        const chapterIdNum = Number(idSlugs["chapter-id"]);
        const noteIdNum = Number(idSlugs["note-id"]);

        const response = await getNote(noteIdNum, chapterIdNum, userId);
        if (!response) {
            return NextResponse.json({ message: "Could not find note for the given user chapter." }, { status: 404 });
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}


export async function PUT(request: Request, { params }: { params: Promise<{ "chapter-id": string, "note-id": string }> }) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

        const idSlugs = (await params);
        const body = await request.json();
        const chapterIdNum = Number(idSlugs["chapter-id"]);
        const noteIdNum = Number(idSlugs["note-id"]);

        const noteFromDb = await getNote(noteIdNum, chapterIdNum, userId)
        if (!noteFromDb) {
            return NextResponse.json({ message: "Could not find note for the given user chapter." }, { status: 404 });
        }

        noteFromDb.content = body.content;

        const validationResult = validateNote(noteFromDb);
        if (!validationResult.isValid) {
            return NextResponse.json({ message: validationResult.message }, { status: 400 });
        }

        const response = await updateNote(noteFromDb);
        if (!response) {
            return NextResponse.json({ message: "Could not update note for the given user chapter." }, { status: 400 });
        }

        return NextResponse.json(response, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ "chapter-id": string, "note-id": string }> }) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const idSlugs = (await params);
        const noteIdNum = Number(idSlugs["note-id"]);

        const response = await deleteNote(noteIdNum);
        if (!response) {
            return NextResponse.json({ message: "Could not delete note for the given user chapter." }, { status: 400 });
        }

        return new Response(null, { status: 204 })

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}
