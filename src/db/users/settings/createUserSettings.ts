import { queryDataRowCount } from "@/db/dbHelper";
import { UserSettings } from "@/shared.types";
import { DefaultUserSettings } from "@/constants/constants";

export async function createUserSettings(userSettings : UserSettings)
{
    try {
        if (!userSettings.userId) {
            throw new Error("userId is required to create UserSettings");
        }

        const query =
        {
            text: `INSERT INTO 
                        user_settings (user_id,ai_helper_credits,global_chapter_days_before_review_due)
                    VALUES ($1, $2, $3)`,
            values: [userSettings?.userId, 
                userSettings.aiHelperCredits ?? DefaultUserSettings.AI_HELPER_CREDITS, 
                userSettings.globalChapterDaysBeforeReviewDue ?? DefaultUserSettings.GLOBAL_CHAPTER_DAYS_BEFORE_REVIEW_DUE]
        };

        const resultRowCount = await queryDataRowCount(query);
        return resultRowCount;
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}