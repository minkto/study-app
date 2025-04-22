import { Chapter } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getChaptersByResource(resourceId: number, searchTerm: string | null | undefined) {

    let queryParams = [ resourceId, `%${searchTerm}%`];
    let query = "SELECT * FROM chapters WHERE resource_id = $1 AND name ILIKE $2";

    if (searchTerm === undefined || searchTerm === null || searchTerm === "" ) {
        query = "SELECT * FROM chapters WHERE resource_id = $1";
        queryParams = [resourceId];
    }

    const queryResult = await queryData(query, queryParams);

    if (queryResult?.length > 0) {
        const chapters = queryResult.map<Chapter>((x) => (
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

    return null;
}