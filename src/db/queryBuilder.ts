import { isStringEmpty } from "@/utils/stringUtils";

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
