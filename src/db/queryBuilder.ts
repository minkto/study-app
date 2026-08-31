import { isStringEmpty } from "@/utils/stringUtils";
import { queryData } from "./dbHelper";

export function buildOrderByFilter(columnNames: Map<string, string>,
    sortBy: string | undefined,
    sortOrder: string | undefined,
    defaultColumn: string | undefined): string {

    const mapOrderByColumnsToSqlValue = mapOrderByColumnsToSql(columnNames, sortBy);
    if (!isStringEmpty(mapOrderByColumnsToSqlValue) && !isStringEmpty(sortBy) && !isStringEmpty(sortOrder)) {
        return ` ORDER BY ${mapOrderByColumnsToSqlValue} ${mapSortOrderColumnsToSql(sortOrder)} `;
    }

    return ` ORDER BY ${defaultColumn} asc`;

}

export const mapOrderByColumnsToSql = (columnNames: Map<string, string>, sortByValue: string | undefined): string => {

    if (!isStringEmpty(sortByValue) && columnNames.has(sortByValue?.toLowerCase() as string)) {
        return columnNames.get(sortByValue?.toLowerCase() as string) ?? ""
    }

    return "";
}


export const buildPageLimit = (pageSize: number, currentPage: number) => {

    if (currentPage) {
        return ` LIMIT ${pageSize} OFFSET ${pageSize * (Number(currentPage) - 1)}`;
    }

    return ` LIMIT ${pageSize} `;
}

export const calculatePageCount = async (
    pageSize: number,
    countQuery: string,
    values: Array<string | number | boolean | undefined | null> = []): Promise<number> => {

    try {
        if (!Number.isInteger(pageSize) || pageSize <= 0) {
            throw new Error("Invalid page size.");
        }

        const countQueryResult = await queryData(countQuery, values);
        const totalCount = Number(countQueryResult[0]?.count ?? 0);
        return Math.ceil(totalCount / pageSize);
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
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
