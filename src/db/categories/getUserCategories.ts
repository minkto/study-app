import { Category } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getUserCategories(userId: string | null) {

    if(!userId) 
    {
        throw new Error("Invalid user id for fetching user categories.");
    }

    const queryResult = await queryData("SELECT * FROM categories WHERE user_id = $1", [userId]);
    if (queryResult?.length > 0) {
        const categories = queryResult.map<Category>((x) => (
            {
                categoryId: x.category_id,
                name: x.name
            }
        ));
        return categories;
    }
}