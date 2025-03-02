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

        if (result.length > 0) {
            const row = result[0];

            // Map database columns to Chapter properties
            const updatedChapter: Chapter = {
                chapterId: row.chapter_id,
                resourceId: row.resource_id,
                statusId: row.status_id,
                name: row.name,
                url: row.url,
                originalDateCompleted: row.original_date_completed,
                lastDateCompleted: row.last_date_completed
            };

            return updatedChapter;
        }

        return null;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}