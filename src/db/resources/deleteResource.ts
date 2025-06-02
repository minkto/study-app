import { queryWithTranscation } from "../dbHelper";

export async function deleteResource(id: number) {
    try {
        const query =
            [
                {
                    text: "DELETE FROM chapters WHERE resource_id = $1",
                    values: [id]
                },
                {
                    text: "DELETE FROM resources WHERE resource_id = $1",
                    values: [id]
                },
            ]

        const result = queryWithTranscation(query);
        return result;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}