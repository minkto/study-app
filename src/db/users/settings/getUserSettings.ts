import { queryDataSingleRow } from "@/db/dbHelper"
import { UserSettings } from "@/shared.types";

export async function getUserSettings(userId: string) {

    const query =
    {
        text: `SELECT
                    us.user_setting_id,
                    u.clerk_user_id AS user_id, 
	                us.ai_helper_credits,
	                us.global_chapter_days_before_review_due

                FROM users u 
                INNER JOIN user_settings us ON u.user_id = us.user_id 
                WHERE u.clerk_user_id = $1 `,
        values: [userId]
    }

    const result = await queryDataSingleRow(query.text, query.values);
    if (result !== undefined && result !== null) {
        const userSettings: UserSettings =
        {
            userSettingId: result['user_setting_id'],
            userId: result['user_id'],
            aiHelperCredits: result['ai_helper_credits'],
            globalChapterDaysBeforeReviewDue: result['global_chapter_days_before_review_due']
        }

        return userSettings;
    }
}