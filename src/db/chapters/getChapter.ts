import { Chapter } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export async function getChapter(chapterId: number) {
    const queryResult = await queryDataSingleRow("SELECT * FROM chapters WHERE chapter_id = $1", [chapterId]);

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