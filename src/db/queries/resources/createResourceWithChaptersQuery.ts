import { DbQuery } from "@/db/dbHelper";
import { Resource } from "@/shared.types";

export function createResourceWithChaptersQuery(resource: Resource): DbQuery {

    const chapterValuesSql = resource?.chapters?.map((c, index) => {
        const startingInsertTokenIndex = 4;
        const columnCount = 4;
        const baseIndex = startingInsertTokenIndex + (index * columnCount);

        return `($${baseIndex}, $${baseIndex + 1}, $${baseIndex + 2}, $${baseIndex + 3}, $${baseIndex + 4})`
    }).join(',\n')


    const query = `
        WITH new_resource AS (
            INSERT INTO resources (name, description, category_id, user_id) 
            VALUES ($1, $2, $3, $4)
            RETURNING resource_id
        )
        INSERT INTO chapters(
            resource_id,
            name,
            url,
            original_date_completed,
            last_date_completed
        )
        SELECT 
            resource_id,
            chapter_data.name,
            chapter_data.url,
            chapter_data.original_date_completed::timestamp without time zone,
            chapter_data.last_date_completed::timestamp without time zone
        FROM new_resource
        CROSS JOIN (
            VALUES 
                ${chapterValuesSql}
        ) AS chapter_data(status_id, name, url, original_date_completed, last_date_completed)
    `

    const values = [
        resource.name,
        resource.description,
        resource.categoryId,
        resource.userId?.toString(),
    ];

    if (resource.chapters) {
        values.push(...resource.chapters.flatMap(chap => [
            chap.name,
            chap.url,
            chap.originalDateCompleted?.toString(),
            chap.lastDateCompleted?.toString()
        ]))
    }

    return {
        text: query,
        values: values
    };
}
