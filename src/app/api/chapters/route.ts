import { createChapter } from "@/db/chapters/createChapter";
import resourceWithUserExists from "@/db/resources/resourceWithUserExists";
import { validateChapter } from "@/services/validateChaptersService";
import { AppUser, Chapter } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

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

    const resourceExists = await resourceWithUserExists(res["resourceId"], currentUser.userId);
    if (!resourceExists) {
        return NextResponse.json({ message: "Forbidden: You do not own this chapter." }, { status: 403 });
    }

    const result = await createChapter(chapter);
    return NextResponse.json(result, { status: 200 });
});
