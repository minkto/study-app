import { getUserSettings } from "@/db/users/settings/getUserSettings";
import { updateUserSettings } from "@/db/users/settings/updateUserSettings";
import { validateUserSettings } from "@/services/validateUserSettingsService";
import { AppUser, UserSettings } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser) => {

    const userSettings = await getUserSettings(currentUser.userId);

    if (userSettings === null || userSettings === undefined) {
        return NextResponse.json({ message: "Could not find user settings." }, { status: 404 })
    }

    return NextResponse.json(userSettings, { status: 200 });
});


export const PUT = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const res = await request.json();

    const userSettings: UserSettings = {
        userId: currentUser.userId,
        aiHelperCredits: res['aiHelperCredits'],
        globalChapterDaysBeforeReviewDue: Math.floor(res['globalChapterDaysBeforeReviewDue'])
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
});
