import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResource(id: number, userId: string | null) {
    try {
        const resourceQueryResult = await queryData(
            `SELECT
            r.*,
            c.name AS category_name,
            c.color AS color
        FROM Resources r
        LEFT JOIN categories c ON r.category_id = c.category_id
        WHERE r.resource_id = $1 AND r.user_id = $2`, [id, userId]);
        const resource = resourceQueryResult.map<Resource>((x) => (
            {
                resourceId: x.resource_id,
                name: x.name,
                description: x.description,
                categoryId: x.category_id,
                categoryName: x.category_name,
                categoryColor: x.color,
                isPinned: x.is_pinned
            }))[0];

        return resource;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}