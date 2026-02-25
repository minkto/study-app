import { Category } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function updateCategory(category: Category, userId: number): Promise<Category | null> {
    try {

        const result = await queryData('UPDATE categories SET name = $1 WHERE category_id =$2 AND user_id = $3 RETURNING *',
            [category.name, category.categoryId, userId]);

        if (result.length > 0) {
            const row = result[0];

            return {
                categoryId: row['category_id'],
                name: row['name']
            };
        }


    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }

    return null;
}