import { queryDataRowCount } from "../dbHelper";

export async function createCategory(name: string, userId: number | null) {
    try {

        if(!name) {
            throw new Error("Invalid name parameter for creating category.");
        }

        if(!userId) {
            throw new Error("Invalid user id for creating category.");
        }

        const query =
        {
            text: "INSERT INTO categories (name,user_id) VALUES ($1,$2)",
            values: [name, userId]
        }

        return await queryDataRowCount(query);

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}