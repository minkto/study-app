import { Chapter, ListingSearchQuery, ListingSearchQueryFilters } from "@/shared.types";
import { queryData } from "../dbHelper";
import { isStringEmpty } from "@/utils/stringUtils";
import { ListingPageSizes } from "@/constants/constants";
import { buildOrderByFilter } from "../queryBuilder";

export async function getChaptersByResource(resourceId: number, listingSearchQuery: ListingSearchQuery | null | undefined) {

    const columnsToSql : Map<string,string> = new Map([
        ["name","name"],
        ["statusid","status_id"],
        ["originaldatecompleted","original_date_completed"],
        ["lastdatecompleted","last_date_completed"],
        ["dayssincecompleted","days_since_last_completed"], 
    ]);

    let queryParams = [resourceId, `%${listingSearchQuery?.searchTerm}%`];
    let query = "SELECT *, COALESCE(CAST((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date - (last_date_completed AT TIME ZONE 'UTC')::date  AS integer), 0) AS days_since_last_completed FROM chapters WHERE resource_id = $1 AND name ILIKE $2";

    const pageSize = parseInt(process.env.CHAPTERS_MAX_PAGE_SIZE || ListingPageSizes.CHAPTERS);
    const totalPageCount = await calculatePageCount(resourceId, listingSearchQuery, pageSize);

    if (isStringEmpty(listingSearchQuery?.searchTerm)) {
        query = "SELECT *, COALESCE(CAST((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date - (last_date_completed AT TIME ZONE 'UTC')::date  AS integer), 0) AS days_since_last_completed  FROM chapters WHERE resource_id = $1";
        queryParams = [resourceId];
    }

    if (listingSearchQuery?.filters?.status !== undefined) {
        query += ` ${ buildFilterQuery(listingSearchQuery?.filters)}`;
    }

    query += buildOrderByFilter(columnsToSql,listingSearchQuery?.sortBy,listingSearchQuery?.sortOrder,"chapter_id");

    if (listingSearchQuery?.page) {
        query += ` LIMIT ${pageSize} OFFSET ${pageSize * (Number(listingSearchQuery.page) - 1)}`;
    }
    else {
        query += ` LIMIT ${pageSize} `;
    }

    const queryResult = await queryData(query, queryParams);

    if (queryResult?.length > 0) {
        const chapters = queryResult.map<Chapter>((x) => (
            {
                chapterId: x.chapter_id,
                resourceId: x.resource_id,
                statusId: x.status_id,
                name: x.name,
                lastDateCompleted: x.last_date_completed,
                originalDateCompleted: x.original_date_completed,
                daysSinceCompleted: x.days_since_last_completed
            }
        ));

        return { chapters: chapters, chaptersCount: totalPageCount };
    }

    return null;
}

const calculatePageCount = async (resourceId: number, listingSearchQuery: ListingSearchQuery | null | undefined, pageSize: number) => {
    let countQuery = "SELECT COUNT(*) FROM chapters WHERE resource_id = $1 AND name ILIKE $2";
    let countQueryParams = [resourceId, `%${listingSearchQuery?.searchTerm}%`];


    if (isStringEmpty(listingSearchQuery?.searchTerm)) {
        countQuery = "SELECT COUNT(*) FROM chapters WHERE resource_id = $1";
        countQueryParams = [resourceId];
    }

    if (listingSearchQuery?.filters?.status !== undefined) {
        countQuery += ` ${ buildFilterQuery(listingSearchQuery?.filters)}`;
    }


    const countQueryResult = await queryData(countQuery, countQueryParams);
    const totalPageCount = Math.ceil(Number(countQueryResult[0].count / pageSize));
    return totalPageCount;
}

const buildFilterQuery = (filters: ListingSearchQueryFilters) => {

    let queryFilter = "";

    if(filters.status !== undefined && filters.status.length > 0)
    {
       queryFilter += `AND status_id IN(${filters.status?.map(x => `${mapStatusFilter(x)}`)})`;
    }

    if (filters.daysSinceLastCompleted !== undefined && filters.daysSinceLastCompleted.length > 0) {
        const daysSinceLastCompletedQuery = filters.daysSinceLastCompleted?.map(
            (x) => (`AND ${daysSinceLastCompletedFilter(x)} `)).join(' ');

        return queryFilter += daysSinceLastCompletedQuery;
    }

    return queryFilter;
}

const mapStatusFilter = (value: string | undefined): string => {
    switch (value) {
        case "Not Started":
            return "0";
        case "In Progress":
            return "1";
        case "Completed":
            return "2";
        default:
            "";
    }

    return "";
}

const daysSinceLastCompletedFilter = (value: string | undefined): string => {
    switch (value) {
        case "Less Than 10 Days":
            return "CURRENT_DATE  - last_date_completed :: date < 10";
        case "Less Than 20 Days":
            return "CURRENT_DATE  - last_date_completed :: date < 20";
        case "Less Than 30 Days":
            return "CURRENT_DATE  - last_date_completed :: date < 30";
        case "Equal to 30 Days":
            return "CURRENT_DATE  - last_date_completed :: date = 0";
        case "Greater Than 30 Days":
            return "CURRENT_DATE  - last_date_completed :: date > 30";
        default:
            "";
    }

    return "";
}