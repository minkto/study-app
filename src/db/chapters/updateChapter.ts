import { Chapter } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function updateChapter(chapter: Chapter) {
    try {

        const result = await queryData(`UPDATE chapters
                    SET 
                        resource_id = $2,
                        status_id = $3,
                        name = $4,
                        url = $5,
                        original_date_completed = $6,
                        last_date_completed = $7
                    WHERE
                        chapter_id = $1
                        RETURNING *`, [
            chapter.chapterId,
            chapter.resourceId,
            chapter.statusId,
            chapter.name,
            chapter.url,
            chapter.originalDateCompleted,
            chapter.lastDateCompleted
        ]);

        return result;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}