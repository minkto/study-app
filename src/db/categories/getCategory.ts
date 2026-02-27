import { Category } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getCategory(categoryId: string, userId: number | null): Promise<Category | null> {

    try {
        if (!userId) {
            throw new Error("Invalid user id for fetching user category.");
        }

        const queryResult = await queryData(`SELECT * FROM categories 
        WHERE category_id = $1 
        AND user_id = $2
         LIMIT 1`, [categoryId, userId]);

        if (queryResult?.length > 0) {
            const rowResult = queryResult[0];

            return {
                userId: userId,
                categoryId: rowResult.category_id,
                name: rowResult.name
            }
        }
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }

    return null;
}