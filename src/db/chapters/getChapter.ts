import { Chapter } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export async function getChapter(chapterId: number, userId: string | null) {
    const queryResult = await queryDataSingleRow(
        `SELECT c.* FROM chapters c
            INNER JOIN resources r ON r.resource_id = c.resource_id
        WHERE c.chapter_id = $1 AND r.user_id = $2`, [chapterId, userId]);

    if (queryResult !== null && queryResult !== undefined) {
        const chapter: Chapter =
        {
            chapterId: queryResult.chapter_id,
            resourceId: queryResult.resource_id,
            statusId: queryResult.status_id,
            name: queryResult.name,
            url: queryResult.url,
            lastDateCompleted: queryResult.last_date_completed,
            originalDateCompleted: queryResult.original_date_completed
        };

        return chapter;

    }
    return null;
}