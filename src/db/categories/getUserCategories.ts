import { Category, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";
import { buildPageLimit, calculatePageCount } from "../queryBuilder";
import { ListingPageSizes } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";

export async function getUserCategories(query: ListingSearchQuery): Promise<Category[] | null> {

    try {
        const values = [];

        if (!isStringEmpty(query.searchTerm)) {
            values.push(`%${query.searchTerm}%`);
        }

        const queryResult = await queryData(buildGetUserCategoriesQuery(query), values);
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

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
    return null;

}

export const getUserCategoriesPageCount = async (listingSearchQuery: ListingSearchQuery) => {

    return await calculatePageCount(
        listingSearchQuery,
        Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES),
        buildGetUserCategoriesQuery(listingSearchQuery, true),
        [],
    )
}

export const buildGetUserCategoriesQuery = (query: ListingSearchQuery, excludePageLimit: boolean = false) => {
    let querySql = `SELECT * FROM categories c`;

    if (!query.userId) {
        throw new Error("Invalid user id for fetching user categories.");
    }

    if (query.sortBy && query.sortOrder) {
        const safeSortOrder = query.sortOrder.toUpperCase() === "DESC" ? "DESC" : "ASC";
        querySql += ` ORDER BY name ${safeSortOrder}`;
    }

    querySql += buildCategoriesFilterQuery(query);

    if (!excludePageLimit) {
        querySql += buildPageLimit(Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES), Number(query.page));
    }

    return querySql;
}

export const buildCategoriesFilterQuery = (searchQuery?: ListingSearchQuery | undefined): string => {

    let queryFilter = "";

    if (!isStringEmpty(searchQuery?.searchTerm)) {
        queryFilter = ` WHERE c.name ILIKE $1`;
    }

    if (searchQuery !== undefined &&
        searchQuery.filters !== undefined &&
        searchQuery.filters.category !== undefined &&
        searchQuery.filters.category.length > 0) {
        if (isStringEmpty(searchQuery?.searchTerm)) {
            queryFilter += ` WHERE c.name IN(${searchQuery.filters.category?.map(x => `'${x}'`)})`;
        }
        else {
            queryFilter += ` AND c.name IN(${searchQuery.filters.category?.map(x => `'${x}'`)})`;
        }
    }

    if (isStringEmpty(queryFilter) && !isStringEmpty(searchQuery?.userId?.toString())) {
        queryFilter = ` WHERE c.user_id = '${searchQuery?.userId}'`;
    }
    else if (!isStringEmpty(queryFilter)) {
        queryFilter += ` AND c.user_id = '${searchQuery?.userId}'`;
    }

    return queryFilter;
}
