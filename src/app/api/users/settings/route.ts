import { getUserSettings } from "@/db/users/settings/getUserSettings";
import { updateUserSettings } from "@/db/users/settings/updateUserSettings";
import { getCurrentAppUser } from "@/services/auth/userService";
import { validateUserSettings } from "@/services/validateUserSettingsService";
import { UserSettings } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET() {
    const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }

    const { userId } = currentUser;
    const userSettings = await getUserSettings(userId);
    
    if (userSettings === null || userSettings === undefined) {
        return NextResponse.json({ message: "Could not find user settings." }, { status: 404 })
    }

    return NextResponse.json(userSettings, { status: 200 });
}


export async function PUT(request: Request) {
    const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        return new Response(
            JSON.stringify({ error: "Unauthorized" }),
            { status: 401 }
        );
    }

    const { userId } = currentUser;
    const res = await request.json();

    const userSettings: UserSettings = {
        userId: userId,
        aiHelperCredits: res['aiHelperCredits'],
        globalChapterDaysBeforeReviewDue: res['globalChapterDaysBeforeReviewDue']
    }

    const validationModel = validateUserSettings(userSettings);

    if (!validationModel.isValid) {
        return NextResponse.json({ message: validationModel.message }, { status: 400 });
    }

    const result = await updateUserSettings(userSettings);

    if (result === null || result === undefined) {
        return NextResponse.json({ message: "Could not find user settings." }, { status: 404 })
    }

    return NextResponse.json(result, { status: 200 });
}