import { queryDataRowCount } from "../dbHelper";

export async function deleteCategory(categoryId: string, userId: number | null) {

    try {
        if (!categoryId) {
            throw new Error("Invalid category ID parameter for deleting category.");
        }
        if (!userId) {
            throw new Error("Invalid user id for deleting category.");
        }

        const query =
        {
            text: "DELETE FROM categories WHERE category_id = $1 AND user_id = $2",
            values: [categoryId, userId]
        }

        const result = await queryDataRowCount(query);
        return result;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}