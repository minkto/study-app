import { Resource } from "@/shared.types";
import { DbQuery, queryDataRowCount, queryWithTranscation } from "../dbHelper";
import { createResourceWithChaptersQuery } from "../queries/resources/createResourceWithChaptersQuery";

export async function createResource(resource: Resource) {
    try {

        if (resource["userId"] === null || resource["userId"] === undefined) {
            return null;
        }

        const query =
        {
            text: "INSERT INTO resources(name,description,category_id,user_id)VALUES($1,$2,$3,$4)",
            values: [
                resource["name"],
                resource["description"],
                resource["categoryId"],
                resource["userId"]
            ]
        }

        const resultRowCount = await queryDataRowCount(query);
        return resultRowCount;

    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}

export async function bulkCreateResourcesWithChapters(resources: Resource[], userId: string): Promise<boolean> {

    let result = false;
    let queries: DbQuery[] = [];

    for (const resource of resources) {
        resource.userId = userId;
        queries.push(createResourceWithChaptersQuery(resource));
    } 

    result = await queryWithTranscation(queries);

    return result;
}