import { ChapterStatuses } from "@/constants/constants";
import { queryDataSingleRow } from "../dbHelper";
import { ChaptersProgressDetails } from "@/shared.types";

export async function getChaptersProgressDetails(resourceId: number) : Promise<ChaptersProgressDetails | undefined> {

    try {
        const result = await queryDataSingleRow(
            `SELECT 
	            (CASE WHEN COUNT(*) = 0 
		        THEN 100 
	            ELSE ROUND((COUNT(CASE WHEN status_id = 2 THEN 1 ELSE NULL END) /  CAST(COUNT(*) AS NUMERIC))  * 100.0) END )  AS chapters_percentage_completed,
	        SUM(CASE WHEN status_id = $1 THEN 1 ELSE 0 END) as total_chapters_complete,
	        (SELECT COUNT(*) FROM chapters WHERE resource_id = $2) AS total_chapters
            FROM chapters WHERE resource_id = $2`, [ChapterStatuses.COMPLETED, resourceId]);

        return {
            percentageCompleted: result.chapters_percentage_completed,
            totalChaptersComplete: result.total_chapters_complete,
            totalChapters: result.total_chapters
        };
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}

export default getChaptersProgressDetails;