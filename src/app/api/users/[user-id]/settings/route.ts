import { getUserSettings } from "@/db/users/settings/getUserSettings";
import { updateUserSettings } from "@/db/users/settings/updateUserSettings";
import { validateUserSettings } from "@/services/validateUserSettingsService";
import { UserSettings } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "user-id": string }> }) {
    const { userId } = await auth();

    if (isStringEmpty(userId)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const slug = (await params);
    const userIdNum = slug["user-id"];

    const userSettings = await getUserSettings(userIdNum);
    if (userSettings === null || userSettings === undefined) {
        return NextResponse.json({ message: "Could not find user settings." }, { status: 404 })
    }

    return NextResponse.json(userSettings, { status: 200 });
}


export async function PUT(request: Request, { params }: { params: Promise<{ "user-id": string }> }) {
    const { userId } = await auth();

    if (isStringEmpty(userId)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const res = await request.json();
    const slug = (await params);
    const userUid = slug["user-id"];

    const userSettings: UserSettings =
    {
        userId: res['userId'],
        userUid : userUid,
        aiHelperCredits: res['aiHelperCredits'],
        globalChapterDaysBeforeReviewDue: res['globalChapterDaysBeforeReviewDue']
    }

    const validationModel = validateUserSettings(userSettings);
    
    if (!validationModel.isValid) {
        return NextResponse.json({ message: validationModel.message }, { status: 400 });
    }

    const result = await updateUserSettings(userUid, userSettings);

    if (result === null || result === undefined) {
        return NextResponse.json({ message: "Could not find user settings." }, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 });
}