import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function updateResource(id: number, resource: Resource) {
    try {
        const resourceToUpdate: Resource =
        {
            resourceId: id,
            name: resource.name,
            categoryId: resource.categoryId,
            description: resource.description,
            isPinned: resource.isPinned
        }

        const result = await queryData(
            `UPDATE resources
        SET
            name = $2,
            description = $3,
            category_id = $4,
            is_pinned = $5,
            updated_at = now()
        WHERE resource_id = $1`,
            [
                resourceToUpdate.resourceId,
                resourceToUpdate.name,
                resourceToUpdate.description,
                resourceToUpdate.categoryId,
                resourceToUpdate.isPinned
            ]);

        return result;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}