import { getChaptersByResource } from "@/db/chapters/getChaptersByResource";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ "resource-id": number }> }) {
    try {
        const slug = (await params);
        const searchParams = request.nextUrl.searchParams;
        const searchTermQuery = searchParams?.get('search-term')?.trim();

        const chapters = await getChaptersByResource(slug["resource-id"],searchTermQuery);
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
