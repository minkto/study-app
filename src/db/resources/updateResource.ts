import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function updateResource(id: number, resource: Resource) {
    const resourceToUpdate: Resource =
    {
        resourceId: id,
        name: resource.name,
        categoryId: resource.categoryId,
        description: resource.description
    }

    const result = await queryData(
        `UPDATE resources 
        SET 
            name = $2,
            description = $3,
            category_id = $4
        WHERE resource_id = $1`,
        [
            resourceToUpdate.resourceId,
            resourceToUpdate.name,
            resourceToUpdate.description,
            resourceToUpdate.categoryId
        ]);

    return result;
}