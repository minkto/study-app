import { ChapterStatuses } from "@/constants/constants";
import { queryDataSingleRow } from "../dbHelper";

export async function getResourcePercentageComplete(resourceId: number) {

    try {
        const result = await queryDataSingleRow(
            `SELECT  
	(CASE WHEN COUNT(*) = 0 THEN 100 
	ELSE ROUND((COUNT(CASE WHEN status_id = $1 THEN 1 ELSE NULL END) /  CAST(COUNT(*) AS NUMERIC))  * 100.0) END )  AS chapters_percentage_completed
FROM Chapters WHERE resource_id = $2`, [ChapterStatuses.COMPLETED, resourceId]);

        return result.chapters_percentage_completed;
    }
    catch (error) {
        return { message: 'Database error', error };
    }
}

export default getResourcePercentageComplete;