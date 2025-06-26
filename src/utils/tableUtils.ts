import { Row, SortDirection } from "@tanstack/react-table";
import { Chapter } from "@/shared.types";
import { ChangeEvent } from "react";

export const getSortDirectionTitle = (nextOrder: SortDirection | false) => {

    if (nextOrder === 'asc') {
        return 'Sort ascending'
    };
    if (nextOrder === 'desc') {
        return 'Sort descending'
    };

    return 'Clear sort';
};

export const nullableDateTimeSortingFn = (rowA: Row<Chapter>, rowB: Row<Chapter>, columnId: string) => {

    const rowADate = rowA.getValue<Date | null>(columnId);
    const rowBDate = rowB.getValue<Date | null>(columnId);
    const timeA = rowADate ? new Date(rowADate).getTime() : -Infinity;
    const timeB = rowBDate ? new Date(rowBDate).getTime() : -Infinity;

    return timeA - timeB;
};

export const getInitialSortByOption = (sorting: { id: string; desc: boolean }[]): string => {

    if (sorting && sorting?.length > 0) {
        const sortBy = sorting[0].id;
        const sortOrder = sorting[0].desc ? "desc" : "asc";
        return `${sortBy}-${sortOrder}`;
    }
    return 'none';
};

export const getCurrentSortOrder = (e: ChangeEvent<HTMLSelectElement>) => {
    const fullSelectValue = e.target.value;
    if (fullSelectValue !== "none") {
        const sortValue = fullSelectValue.split("-");
        return [{ id: sortValue[0], desc: (sortValue[1]?.toLowerCase() === 'desc') }]
    }

    return [];

}