import { getChaptersByResourceId } from "@/db/chapters/getChaptersByResourceId";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "resource-id": number }> }) {
    try {
        const slug = (await params);

        const chapters = await getChaptersByResourceId(slug["resource-id"]);
        if (chapters === null || chapters === undefined) {
            return NextResponse.json({ message: "Could not find chapter with resource id." }, { status: 404 });
        }

        return NextResponse.json(chapters, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}
