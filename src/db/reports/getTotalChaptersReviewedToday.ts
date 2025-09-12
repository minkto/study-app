import { queryDataSingleRow } from "../dbHelper";

export const getTotalChaptersReviewedToday = async (userId: string): Promise<number | undefined> => {
    try {
        const query =
            `SELECT
		        COUNT(CASE 
				WHEN c.last_date_completed IS NOT NULL 
                    AND c.last_date_completed::date = (NOW() AT TIME ZONE 'UTC')::date
					THEN 1 
					ELSE NULL 
				END) chapters_completed_today
    FROM Chapters c
        INNER JOIN resources r ON r.resource_id = c.resource_id
    WHERE r.user_id =$1`

        const result = await queryDataSingleRow(query, [userId]);
        return result.chapters_completed_today

    }
    catch (error) {
        console.log("An error has occured in the database: ", error);
    }
}