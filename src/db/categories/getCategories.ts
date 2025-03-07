import { Category } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getCategories() {
    const queryResult = await queryData("SELECT * FROM categories");

    if (queryResult?.length > 0) {
        const categories = queryResult.map<Category>((x) => (
            {
                categoryId: x.category_id,
                name: x.name
            }
        ));

        return categories;
    }

    return null;
}