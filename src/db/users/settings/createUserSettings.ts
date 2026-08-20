import { queryDataSingleRow } from "@/db/dbHelper";
import { UserSettings } from "@/shared.types";
import { DefaultUserSettings } from "@/constants/constants";

export async function createUserSettings(userSettings: UserSettings) {
    try {
        if (!userSettings.userId) {
            throw new Error("userId is required to create UserSettings");
        }

        const query =
        {
            text: `INSERT INTO 
                        user_settings (user_id,ai_helper_credits,global_chapter_days_before_review_due)
                    VALUES ($1, $2, $3)
                    ON CONFLICT (user_id) DO UPDATE SET user_id = EXCLUDED.user_id
                    RETURNING *;`,
            values: [userSettings?.userId,
            userSettings.aiHelperCredits ?? DefaultUserSettings.AI_HELPER_CREDITS,
            userSettings.globalChapterDaysBeforeReviewDue ?? DefaultUserSettings.GLOBAL_CHAPTER_DAYS_BEFORE_REVIEW_DUE]
        };

        const userSettingsResult = await queryDataSingleRow(
            query.text,
            query.values
        );

        if (!userSettingsResult) {
            throw new Error(
                `Failed to ensure user for Clerk user ${userSettingsResult}`
            );
        }

        return {
            userSettingId: userSettingsResult.user_setting_id,
            userId: userSettingsResult.user_id,
            aiHelperCredits: userSettingsResult.ai_helper_credits,
            globalChapterDaysBeforeReviewDue: userSettingsResult.global_chapter_days_before_review_due
        };
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}