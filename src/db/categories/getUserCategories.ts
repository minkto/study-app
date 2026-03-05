import { Category, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";
import { buildPageLimit } from "../queryBuilder";
import { ListingPageSizes } from "@/constants/constants";

export async function getUserCategories(query: ListingSearchQuery): Promise<Category[] | null> {

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

    querySql += buildPageLimit(Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES), Number(query.page))


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

    return null;
}