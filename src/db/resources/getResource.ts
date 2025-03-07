import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResource(id: number) {
    const resourceQueryResult = await queryData("SELECT * FROM Resources WHERE resource_id = $1 LIMIT 1;", [id]);
    const resource = resourceQueryResult.map<Resource>((x) => (
        {
            resourceId: x.resource_id,
            name: x.name,
            description: x.description,
            categoryId: x.category_id
        }))[0];

    return resource;
}