import { Resource } from "@/shared.types";
import { queryDataRowCount } from "../dbHelper";

export async function createResource(resource: Resource) {
    try {
        const query =
        {
            text: "INSERT INTO resources(name,description,category_id)VALUES($1,$2,$3)",
            values: [
                resource["name"],
                resource["description"],
                resource["categoryId"]
            ]
        }

        const resultRowCount = await queryDataRowCount(query);
        return resultRowCount;

    }
    catch (error) {
        console.log()
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}