import { createChapter } from "@/db/chapters/createChapter";
import resourceWithUserExists from "@/db/resources/resourceWithUserExists";
import { validateChapter } from "@/services/validateChaptersService";
import { Chapter } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const res = await request.json();
        const chapter: Chapter =
        {
            name: res["name"],
            resourceId: res["resourceId"],
            statusId: res["statusId"],
            url: res["url"],
            originalDateCompleted: res["originalDateCompleted"],
            lastDateCompleted: res["lastDateCompleted"]
        };

        const validationModel = validateChapter(chapter);
        if (!validationModel.isValid) {
            return NextResponse.json({ message: validationModel.message }, { status: 400 });
        }

        const resourceExists = await resourceWithUserExists(res["resourceId"], userId);
        if (!resourceExists) {
            return NextResponse.json({ message: "Forbidden: You do not own this resource." }, { status: 403 });
        }

        const result = await createChapter(chapter);
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}