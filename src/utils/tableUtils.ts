import { Row, SortDirection } from "@tanstack/react-table";
import { Chapter } from "@/shared.types";

export const getSortDirectionTitle = (nextOrder: SortDirection | false) => {
    
    if (nextOrder === 'asc') 
    {
        return 'Sort ascending'
    };
    if (nextOrder === 'desc') 
    {
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