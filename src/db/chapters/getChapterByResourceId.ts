import { Chapter } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getChaptersByResourceId(resourceId: number) {
    const queyResult = await queryData("SELECT * FROM chapters WHERE resource_id = $1", [resourceId]);

    const chapters = queyResult.map<Chapter>((x) => (
        {
            chapterId: x.chapter_id,
            resourceId: x.resource_id,
            statusId: x.status_id,
            name: x.name,
            lastDateCompleted: x.last_date_completed,
            originalDateCompleted: x.original_date_completed
        }
    ));

    return chapters;
}