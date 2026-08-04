import { createChapter } from "@/db/chapters/createChapter";
import resourceWithUserExists from "@/db/resources/resourceWithUserExists";
import { getCurrentAppUser } from "@/services/auth/userService";
import { validateChapter } from "@/services/validateChaptersService";
import { Chapter } from "@/shared.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {

    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;
        const res = await request.json();
        const chapter: Chapter =
        {
            name: res["name"],
            description: res["description"],
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
            return NextResponse.json({ message: "Forbidden: You do not own this chapter." }, { status: 403 });
        }

        const result = await createChapter(chapter);
        return NextResponse.json(result, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error:', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}