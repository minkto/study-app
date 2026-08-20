import { ChapterStatuses } from "@/constants/constants";
import { queryDataSingleRow } from "../dbHelper";

export const getChaptersReviewedAndInProgress = async (userId: string) => {
    try {
        const query = `WITH c1 AS
( SELECT
	r.user_id,
	COUNT(CASE 
		WHEN c.last_date_completed IS NOT NULL 
			AND c.last_date_completed::date = (NOW() AT TIME ZONE 'UTC')::date
			THEN 1 
			ELSE NULL 
		END) chapters_completed_today,
	COUNT(CASE 
		WHEN c.last_date_completed IS NOT NULL 
		AND 
			date_trunc('month', c.last_date_completed::date) = date_trunc('month', CURRENT_DATE AT TIME ZONE 'UTC')
				THEN 1 
				ELSE NULL 
		END) chapters_completed_current_month,
		SUM(CASE WHEN C.status_id = $2 THEN 1 ELSE 0 END) AS total_in_progress_chapters
FROM Chapters c
	INNER JOIN resources r ON r.resource_id = c.resource_id
WHERE r.user_id = $1
GROUP BY r.user_id
)

SELECT
	c1.chapters_completed_today,
	c1.chapters_completed_current_month,
	c1.total_in_progress_chapters
FROM c1`
        const result = await queryDataSingleRow(query, [userId, ChapterStatuses.IN_PROGRESS]);

        return {
            chaptersCompletedToday: result?.chapters_completed_today,
            chaptersCompletedCurrentMonth: result?.chapters_completed_current_month ,
            chaptersInProgress: result?.total_in_progress_chapters
        }
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}

export default getChaptersReviewedAndInProgress;