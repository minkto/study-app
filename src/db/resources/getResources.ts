import { ListingSearchQuery, Resource } from "@/shared.types";
import { queryData } from "../dbHelper";
import { isStringEmpty } from "@/utils/stringUtils";
import { buildOrderByFilter } from "../queryBuilder";

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
                    LEFT JOIN categories c ON r.category_id = c.category_id
                    WHERE r.name ILIKE $1`

        let queryParams = [`%${listingSearchQuery?.searchTerm}%`];


        if (isStringEmpty(listingSearchQuery?.searchTerm)) {
            query = `SELECT 
                        r.*,
                        c.name AS category_name  
                    FROM resources r
                    LEFT JOIN categories c ON r.category_id = c.category_id`;
            queryParams = [];
        }

        query += buildOrderByFilter(columnsToSql, listingSearchQuery?.sortBy, listingSearchQuery?.sortOrder, "r.resource_id");

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