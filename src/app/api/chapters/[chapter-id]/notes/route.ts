import { getChapter } from "@/db/chapters/getChapter";
import createNote from "@/db/chapters/notes/createNote";
import { Note } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request, { params }: { params: Promise<{ "chapter-id": string }> }) {
    try {

        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const res = await request.json();
        const idSlug = (await params);

        const note: Note =
        {
            chapterId: Number(idSlug["chapter-id"]),
            content: res["content"]
        }

        const chapter = await getChapter(Number(note.chapterId),userId);

        if(!chapter)
        {
            return NextResponse.json({ message: "Could not find the chapter." }, { status: 404 });
        }

        const response = await createNote(note);

        if (!response) {
            return NextResponse.json({ message: "Could not create note." }, { status: 400 });
        }

        return NextResponse.json(response, { status: 200 });


    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}