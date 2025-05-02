import { Chapter, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";
import { isStringEmpty } from "@/utils/stringUtils";
import { ListingPageSizes } from "@/constants/constants";

export async function getChaptersByResource(resourceId: number, listingSearchQuery: ListingSearchQuery | null | undefined) {
    let countQuery = "SELECT COUNT(*) FROM chapters WHERE resource_id = $1 AND name ILIKE $2";
    let countQueryParams = [resourceId, `%${listingSearchQuery?.searchTerm}%`];
    const pageSize = parseInt(process.env.CHAPTERS_MAX_PAGE_SIZE || ListingPageSizes.CHAPTERS);


    if (isStringEmpty(listingSearchQuery?.searchTerm)) {
        countQuery = "SELECT COUNT(*) FROM chapters WHERE resource_id = $1";
        countQueryParams = [resourceId];
    }

    const countQueryResult = await queryData(countQuery, countQueryParams);
    const totalPageCount = Math.ceil(Number(countQueryResult[0].count / pageSize));

    let queryParams = [resourceId, `%${listingSearchQuery?.searchTerm}%`];
    let query = "SELECT * FROM chapters WHERE resource_id = $1 AND name ILIKE $2";

    if (isStringEmpty(listingSearchQuery?.searchTerm)) {
        query = "SELECT * FROM chapters WHERE resource_id = $1";
        queryParams = [resourceId];
    }

    if (!isStringEmpty(listingSearchQuery?.sortBy) && !isStringEmpty(listingSearchQuery?.sortOrder)) {
        query += ` ORDER BY ${mapOrderByColumnsToSql(listingSearchQuery?.sortBy)} ${mapSortOrderColumnsToSql(listingSearchQuery?.sortOrder)} `;
    }
    else {
        query += ` ORDER BY chapter_id desc `;
    }

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
            }
        ));

        return { chapters: chapters, chaptersCount: totalPageCount };
    }

    return null;
}

const mapOrderByColumnsToSql = (sortByValue: string | undefined) => {
    switch (sortByValue?.toLowerCase()) {
        case "name":
            return "name";
        case "statusid":
            return "status_id";
        case "originaldatecompleted":
            return "original_date_completed";
        case "lastdatecompleted":
            return "last_date_completed";
        default:
            return "name";
    }
}

const mapSortOrderColumnsToSql = (sortOrderValue: string | undefined) => {
    switch (sortOrderValue?.toLowerCase()) {
        case "asc":
            return "asc";
        case "desc":
            return "desc";
        default:
            return "asc";
    }
}