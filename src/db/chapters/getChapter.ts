import { Chapter } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export async function getChapter(chapterId: number) {
    const queyResult = await queryDataSingleRow("SELECT * FROM chapters WHERE chapter_id = $1", [chapterId]);

    const chapters: Chapter =
    {
        chapterId: queyResult.chapter_id,
        resourceId: queyResult.resource_id,
        statusId: queyResult.status_id,
        name: queyResult.name,
        lastDateCompleted: queyResult.last_date_completed,
        originalDateCompleted: queyResult.original_date_completed
    };

    return chapters;
}