import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResource(id: number, userId: string | null) {
    const resourceQueryResult = await queryData("SELECT * FROM Resources WHERE resource_id = $1 AND user_id = $2 LIMIT 1;", [id, userId]);
    const resource = resourceQueryResult.map<Resource>((x) => (
        {
            resourceId: x.resource_id,
            name: x.name,
            description: x.description,
            categoryId: x.category_id,
            isPinned: x.is_pinned
        }))[0];

    return resource;
}