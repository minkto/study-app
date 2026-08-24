import { Category, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";
import { buildOrderByFilter, buildPageLimit, calculatePageCount } from "../queryBuilder";
import { ListingPageSizes } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";

export async function getUserCategories(query: ListingSearchQuery): Promise<Category[] | null> {

    try {
        let excludePageLimit = false;

        if (query.pageSize === undefined || query.pageSize === null || query.pageSize === "") {
            excludePageLimit = true;
        }

        const values: Array<string | number> = [];
        const querySql = buildGetUserCategoriesQuery(query, excludePageLimit, values);

        const queryResult = await queryData(querySql, values);
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

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }

}

export const getUserCategoriesPageCount = async (listingSearchQuery: ListingSearchQuery) => {

    const values: Array<string | number> = [];

    let countQuery = `SELECT COUNT(*) FROM categories c`;
    countQuery += buildCategoriesFilterQuery(listingSearchQuery, values);

    return await calculatePageCount(
        Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES),
        countQuery,
        values,
    )
}

const buildGetUserCategoriesQuery = (query: ListingSearchQuery, excludePageLimit: boolean, values: Array<string | number>) => {
    let querySql = `SELECT * FROM categories c`;

    const columnsToSql: Map<string, string> = new Map([
        ["name", "name"],
    ]);

    if (!query.userId) {
        throw new Error("Invalid user id for fetching user categories.");
    }

    querySql += buildCategoriesFilterQuery(query, values);

    querySql += buildOrderByFilter(columnsToSql, query?.sortBy, query?.sortOrder, "c.category_id");


    if (!excludePageLimit) {
        querySql += buildPageLimit(Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES), Number(query.page));
    }

    return querySql;
}


const buildCategoriesFilterQuery = (searchQuery: ListingSearchQuery | undefined, values: Array<string | number>): string => {

    let queryFilter = "";

    if (!isStringEmpty(searchQuery?.searchTerm)) {
        values.push(`%${searchQuery?.searchTerm}%`);
        queryFilter = ` WHERE c.name ILIKE $${values.length}`;
    }

    if (searchQuery !== undefined &&
        searchQuery.filters !== undefined &&
        searchQuery.filters.category !== undefined &&
        searchQuery.filters.category.length > 0) {

        const categoryPlaceholders = searchQuery.filters.category.map((category) => {
            values.push(category);
            return `$${values.length}`;
        }).join(',');

        if (isStringEmpty(searchQuery?.searchTerm)) {
            queryFilter += ` WHERE c.name IN(${categoryPlaceholders})`;
        }
        else {
            queryFilter += ` AND c.name IN(${categoryPlaceholders})`;
        }
    }

    if (isStringEmpty(queryFilter) && !isStringEmpty(searchQuery?.userId?.toString())) {
        values.push(searchQuery?.userId as string | number);
        queryFilter = ` WHERE c.user_id = $${values.length}`;
    }
    else if (!isStringEmpty(queryFilter)) {
        values.push(searchQuery?.userId as string | number);
        queryFilter += ` AND c.user_id = $${values.length}`;
    }

    return queryFilter;
}
