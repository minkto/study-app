import { ListingSearchQuery, ListingSearchQueryFilters, Resource } from "@/shared.types";
import { queryData } from "../dbHelper";
import { isStringEmpty } from "@/utils/stringUtils";
import { buildOrderByFilter } from "../queryBuilder";
import { ListingPageSizes } from "@/constants/constants";

export async function getResources(listingSearchQuery: ListingSearchQuery) {

    try {

        const columnsToSql: Map<string, string> = new Map([
            ["name", "name"],
            ["categoryname", "category_name"]
        ]);


        let query = `SELECT 
                        r.*,
                        c.name AS category_name  
                    FROM resources r
                    LEFT JOIN categories c ON r.category_id = c.category_id`;

        let queryParams: string[] = [];


        if (!isStringEmpty(listingSearchQuery?.searchTerm)) {
            queryParams = [`%${listingSearchQuery?.searchTerm}%`];
        }

        query += buildFilterQuery(listingSearchQuery);

        query += buildOrderByFilter(columnsToSql, listingSearchQuery?.sortBy, listingSearchQuery?.sortOrder, "r.resource_id");

        query += buildPageLimit(listingSearchQuery);

        const resourcesDb = await queryData(query, queryParams);
        const mappedResources = resourcesDb.map<Resource>((x) => (
            {
                name: x.name,
                description: x.description,
                resourceId: x.resource_id,
                categoryName: x.category_name
            }));

        return mappedResources;

    }
    
    catch (error) {
        return { message: 'Database error', error };
    }
}

const buildPageLimit = (listingSearchQuery: ListingSearchQuery) => {
    
    const pageSize = Number(ListingPageSizes.RESOURCES);
    
    if (listingSearchQuery?.page) {
        return ` LIMIT ${pageSize} OFFSET ${pageSize * (Number(listingSearchQuery.page) - 1)}`;
    }

    return ` LIMIT ${pageSize} `;
}

const buildFilterQuery = (searchQuery?: ListingSearchQuery | undefined) => {

    let queryFilter = "";

    if (!isStringEmpty(searchQuery?.searchTerm)) {
        queryFilter = " WHERE r.name ILIKE $1 ";
    }

    if (searchQuery !== undefined &&
        searchQuery.filters !== undefined &&
        searchQuery.filters.category !== undefined &&
        searchQuery.filters.category.length > 0) {
        if (isStringEmpty(searchQuery?.searchTerm)) {
            queryFilter += ` WHERE c.name IN(${searchQuery.filters.category?.map(x => `'${x}'`)}) `;
        }
        else {
            queryFilter += ` AND c.name IN(${searchQuery.filters.category?.map(x => `'${x}'`)}) `;
        }
    }

    return queryFilter;
}

export const calculatePageCount = async (
    listingSearchQuery: ListingSearchQuery | undefined) => {

    const pageCount = Number(ListingPageSizes.RESOURCES);


    let countQuery = `SELECT COUNT(*) 
                    FROM resources r
                    LEFT JOIN categories c ON r.category_id = c.category_id`;

    let countQueryParams = [];


    countQuery += buildFilterQuery(listingSearchQuery);

    if (listingSearchQuery?.searchTerm !== undefined) {
        countQueryParams.push(`%${listingSearchQuery?.searchTerm}%`);
    }

    const countQueryResult = await queryData(countQuery, countQueryParams);
    const totalPageCount = Math.ceil(Number(countQueryResult[0].count / pageCount));
    return totalPageCount;
}