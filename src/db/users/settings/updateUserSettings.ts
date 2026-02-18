import { queryData } from "@/db/dbHelper";
import { UserSettings } from "@/shared.types";

export async function updateUserSettings(userSettings: UserSettings) {
    try {
        const query = `
        UPDATE user_settings
        SET 
            global_chapter_days_before_review_due = $2
        WHERE user_id = $1`

        const result = await queryData(query,
            [
                userSettings.userId,
                userSettings.globalChapterDaysBeforeReviewDue ?? process.env.DEFAULT_DAYS_BEFORE_CHAPTER_REVIEW_DUE ?? 30
            ]);

        return result;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}