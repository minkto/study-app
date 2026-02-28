import { Category } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function updateCategory(category: Category): Promise<Category | null> {
    try {

        const result = await queryData(`UPDATE categories 
            SET name = $1,
            updated_at = NOW()
            WHERE category_id =$2 AND user_id = $3 RETURNING *`,
            [category.name,category.categoryId, category.userId]);

        if (result.length > 0) {
            const row = result[0];

            return {
                userId: row['user_id'],
                categoryId: row['category_id'],
                name: row['name']
            };
        }


    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }

    return null;
}