import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResource(id: number, userId: string | null) {
    const resourceQueryResult = await queryData(
        `SELECT 
            r.*, 
            c.name AS category_name 
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
            isPinned: x.is_pinned
        }))[0];

    return resource;
}