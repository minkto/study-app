import { Chapter } from "@/shared.types";
import { queryDataRowCount } from "../dbHelper";

export async function createChapter(chapter: Chapter) {
    try {    
        const query = 
        {
            text:`INSERT INTO chapters(
	            resource_id,
	            status_id,
	            name,
	            url
            )
            VALUES
            ( 
                $1,
                $2,
                $3,
                $4
            )`,
            values:[chapter.resourceId, chapter.statusId, chapter.name, chapter.url]
        }

        const result = await queryDataRowCount(query);
        return result;
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}