import { queryDataSingleRow } from "../dbHelper";

export const getTotalChaptersReviewedCurrentMonth = async (userId: string) : Promise<number | undefined> => {
    try {
        const query =
            `SELECT
                COUNT(CASE 
					WHEN c.last_date_completed IS NOT NULL 
             		AND 
                        date_trunc('month', c.last_date_completed::date) = date_trunc('month', CURRENT_DATE AT TIME ZONE 'UTC')
						    THEN 1 
						    ELSE NULL 
					END) chapters_completed_current_month
            FROM Chapters c
            INNER JOIN resources r ON r.resource_id = c.resource_id
            WHERE r.user_id = $1`

        const result = await queryDataSingleRow(query, [userId]);

        return result.chapters_completed_current_month
        
    }
    catch (error) {
        console.log("An error has occured in the database: ", error);
    }
}