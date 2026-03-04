import { Category, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getUserCategories(query: ListingSearchQuery) {

    let querySql = `SELECT * FROM categories 
        WHERE user_id = $1`;

    if (!query.userId) {
        throw new Error("Invalid user id for fetching user categories.");
    }

    const queryValues = [query.userId];

    if (query.sortBy && query.sortOrder) {
        const safeSortOrder = query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
        querySql += ` ORDER BY name ${safeSortOrder}`;
    }

    const queryResult = await queryData(querySql, queryValues);
    if (queryResult?.length > 0) {
        const categories = queryResult.map<Category>((x) => (
            {
                userId: x.user_id,
                categoryId: x.category_id,
                name: x.name,
                description: x.description,
                color: x.color,
            }
        ));
        return categories;
    }
}