import { queryData } from "@/db/dbHelper";
import { UserSettings } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";

export async function updateUserSettings(userId: string, userSettings: UserSettings) {
    try {
        const query = `UPDATE user_settings
                    SET 
	                    ai_helper_credits  = $2 , 
	                    global_chapter_days_before_review_due = $3
                    WHERE 
                    user_id = $1`

        if (isStringEmpty(userId)) {
            throw new Error("userId is required to update UserSettings");
        }

        const result = await queryData(query,
            [
                userId,
                userSettings.aiHelperCredits ?? 0,
                userSettings.globalChapterDaysBeforeReviewDue ?? process.env.DEFAULT_DAYS_BEFORE_CHAPTER_REVIEW_DUE ?? 30
            ]);

        return result;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}