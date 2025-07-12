import { Resource } from "@/shared.types";
import { queryDataRowCount } from "../dbHelper";

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