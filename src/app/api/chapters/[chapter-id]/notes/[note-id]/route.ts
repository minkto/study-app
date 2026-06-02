import { getNote } from "@/db/chapters/notes/getNote";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "chapter-id": string, "note-id": string }> }) {

    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

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
