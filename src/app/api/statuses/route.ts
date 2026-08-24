import { getChapterStatuses } from "@/db/chapters/statuses/getChapterStatuses";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async () => {
    const result = await getChapterStatuses();
    if(!result || result.length === 0) {
        return NextResponse.json({ message: "No chapter statuses found." }, { status: 404 });
    }
    return NextResponse.json(result, { status: 200 })
})