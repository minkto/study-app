import { FilterByQueryKeys } from "@/constants/constants";
import { getChaptersByResource } from "@/db/chapters/getChaptersByResource";
import { getCurrentAppUser } from "@/services/auth/userService";
import { ListingSearchQuery } from "@/shared.types";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest, { params }: { params: Promise<{ "resource-id": string }> }) {
    try {
        const slug = (await params);
        const resourceIdNum = Number(slug["resource-id"]);
        const searchParams = request.nextUrl.searchParams;

        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;
        const listingSearchQuery: ListingSearchQuery =
        {
            searchTerm: searchParams?.get('search-term')?.trim(),
            sortBy: searchParams?.get('sortBy')?.trim(),
            sortOrder: searchParams?.get('sortOrder')?.trim(),
            page: searchParams?.get('page')?.trim(),
            pageSize: searchParams?.get('pageSize')?.trim(),
            filters:
            {
                status: searchParams?.getAll(FilterByQueryKeys.ChapterListings.STATUS),
                daysSinceLastCompleted: searchParams?.getAll(FilterByQueryKeys.ChapterListings.DAYS_SINCE_LAST_COMPLETED),
            },
            userId: userId
        };

        const chapters = await getChaptersByResource(resourceIdNum, listingSearchQuery);
        if (chapters === null || chapters === undefined) {
            return NextResponse.json({ message: "Could not find chapters with resource id.", chapters: [], chaptersCount: 0 }, { status: 404 });
        }

        return NextResponse.json(chapters, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}
