import { ChapterStatuses } from "@/constants/constants";
import { queryDataSingleRow } from "../dbHelper";

export const getTotalChaptersInProgress = async (userId: string) : Promise<number | undefined> => {
    try {
        const query =
            `SELECT COUNT(*) AS total_in_progress_chapters 
             FROM Chapters c
             INNER JOIN resources r ON r.resource_id = c.resource_id
             WHERE r.user_id = $1 AND c.status_id = $2`

        const result = await queryDataSingleRow(query, [userId,ChapterStatuses.IN_PROGRESS]);

        return result.total_in_progress_chapters
    }
    catch (error) {
        console.log("An error has occured in the database: ", error);
    }
}