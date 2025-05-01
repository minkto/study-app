import { Chapter, ListingSearchQuery } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getChaptersByResource(resourceId: number, listingSearchQuery: ListingSearchQuery | null | undefined) {

    let queryParams = [ resourceId, `%${listingSearchQuery?.searchTerm}%`];
    let query = "SELECT * FROM chapters WHERE resource_id = $1 AND name ILIKE $2";

    if (listingSearchQuery?.searchTerm === undefined || listingSearchQuery.searchTerm === null || listingSearchQuery.searchTerm === "" ) {
        query = "SELECT * FROM chapters WHERE resource_id = $1";
        queryParams = [resourceId];
    }

    if (listingSearchQuery?.sortBy && listingSearchQuery?.sortOrder ) {
        query += ` ORDER BY ${mapOrderByColumnsToSql(listingSearchQuery?.sortBy)} ${mapSortOrderColumnsToSql(listingSearchQuery?.sortOrder) } `;
    }
    else
    {
        query += ` ORDER BY chapter_id desc `;
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
                originalDateCompleted: x.original_date_completed
            }
        ));

        return chapters;
    }

    return null;
}

const mapOrderByColumnsToSql = (sortByValue : string) =>
{
    switch(sortByValue?.toLowerCase())
    {
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

const mapSortOrderColumnsToSql = (sortOrderValue : string) =>
    {
        switch(sortOrderValue?.toLowerCase())
        {
            case "asc":
                return "asc";
            case "desc":
                return "desc";
            default:
                return "asc";
        }
    }