import { Category } from "@/shared.types";
import { queryDataRowCount } from "../dbHelper";

export async function createCategory(category: Category ) {
    try {

        const query =
        {
            text: "INSERT INTO categories (name,user_id) VALUES ($1,$2)",
            values: [category.name, category.userId]
        }

        return await queryDataRowCount(query);

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}