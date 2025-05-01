import { Chapter } from "@/shared.types";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, Row, RowData, SortingState, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './resource-chapters-listings.module.css'
import CardDropdownMenu from "../card-dropdown-menu/CardDropdownMenu";
import { ChapterStatuses } from "@/constants/constants";
import ListingsSearchBar from "../listings-search-bar/ListingsSearchBar";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { isStringEmpty } from "@/utils/stringUtils";
import { getSortDirectionTitle, nullableDateTimeSortingFn } from "@/utils/tableUtils";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        tdClassName?: (cell: CellContext<TData, TValue>) => string,
    }
};

interface ResourceChaptersListingsProps {
    resourceId?: string
}

const statusMapping = {
    [ChapterStatuses.NOT_STARTED]: { text: "Not Started", class: "progress--not-started" },
    [ChapterStatuses.IN_PROGRESS]: { text: "In Progress", class: "progress--in-progress" },
    [ChapterStatuses.COMPLETED]: { text: "Completed", class: "progress--completed" },
};

const ResourceChaptersListings = ({ resourceId }: ResourceChaptersListingsProps) => {

    const searchParams = useSearchParams();
    const pathname = usePathname();
    const router = useRouter();
    const [data, setData] = useState<Chapter[]>([]);
    const columnHelper = createColumnHelper<Chapter>();
    const [sorting, setSorting] = useState<SortingState>([])

    const constructQueryString = useCallback(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortBy = sorting[0]?.id;
        const sortOrder = sorting[0]?.desc ? "desc" : "asc";

        if (sorting.length === 0) {
            params.delete("sortBy");
            params.delete("sortOrder");
        } else {
            params.set("sortBy", sortBy!);
            params.set("sortOrder", sortOrder);
        }

        return params.size > 0 ? "?" + params.toString() : "";
    }, [searchParams, sorting]);

    const fetchChapters = useCallback(async () => {
        try {

            if (!resourceId) {
                return;
            }

            const response = await fetch(`/api/resources/${resourceId}/chapters${constructQueryString()}`);
            const data = await response.json();
            setData(data);

        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
    }, [resourceId, constructQueryString]);

    const deleteChapter = useCallback(async (chapterId: number | undefined) => {
        try {
            if (resourceId === undefined) {
                console.log("Could not find Chapter Id from the URL");
                return;
            }
            const response = await fetch(`/api/chapters/${chapterId}`, { method: 'DELETE' });
            const data = await response.json();
            setData(data);
        }
        catch (error) {
            console.log("An error has occurred in the API: ", error);
        }
    }, [resourceId]);
    
    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
            enableSorting: true
        }),
        columnHelper.accessor('statusId', {
            cell: (info) => {
                const value = info.getValue();

                // Get the corresponding status
                const status = statusMapping[value ?? ChapterStatuses.NOT_STARTED] || { text: "Unknown", class: "progress--unknown" };
                return status.text;
            },
            header: () => <span>Status</span>,
            meta: {
                tdClassName: (info) => {
                    const value = info.getValue();
                    return styles[statusMapping[value ?? ChapterStatuses.NOT_STARTED].class || "progress--unknown"];
                }
            },
            enableSorting: true,
        }),
        columnHelper.accessor('originalDateCompleted', {
            id: "originaldatecompleted",
            cell: (info) => {
                const date = info.getValue();
                return date ? new Date(date).toLocaleDateString() : null;

            },
            header: () => <span>Original Date Completed</span>,
            enableSorting: true,
            sortingFn: nullableDateTimeSortingFn

        }),
        columnHelper.accessor('lastDateCompleted', {
            id: "lastdatecompleted",
            cell: (info) => {
                const date = info.getValue();
                return date ? new Date(date).toLocaleDateString() : null;
            },
            header: () => <span>Last Date Completed</span>,
            enableSorting: true,
            sortingFn: nullableDateTimeSortingFn
        }),
        columnHelper.accessor('daysSinceCompleted', {
            cell: info => info.getValue(),
            header: () => <span>Days Since Last Completed</span>,
            enableSorting: false
        }),
        {
            id: 'menuOptions',
            header: () => null ,
            cell: ({ row }: { row: Row<Chapter> }) => {
                const chapterId = row.original.chapterId
                return (
                    <CardDropdownMenu links={
                        [
                            { label: "Edit Chapter", href: `chapters/${chapterId}/edit-chapter` },
                            {
                                label: "Delete Chapter",
                                onClick: async () => {
                                    try {
                                        await deleteChapter(chapterId);
                                        await fetchChapters();
                                    } catch (error) {
                                        console.error("Failed to delete chapter:", error);
                                    }
                                },
                            }
                        ]
                    } />
                )
            },
            enableSorting: false,
            enableHiding: false,
        }
    ], [columnHelper, deleteChapter, fetchChapters]);

    const table = useReactTable({
        data,
        columns,
        state:
        {
            sorting,
        },
        manualSorting: true,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        enableMultiSort: false,
        enableSortingRemoval: true,
    });

    // Upon Component Mount, fetch the chapters.
    useEffect(() => {
        fetchChapters();
    }, [fetchChapters]);

    // Upon Column Change, set the query string
    useEffect(() => {
        const queryString = constructQueryString();
        if (queryString) {
            router.push(queryString);
        }
        else {
            router.replace(`${pathname}${queryString}`);
        }

    }, [sorting, constructQueryString, router, pathname]);

    // Upon Component Mount, set the sorting.
    useEffect(() => {
        const params = new URLSearchParams(searchParams?.toString());
        const sortByValue = params.get('sortBy') ?? "";
        const sortOrderValue = params.get('sortOrder');

        if (!isStringEmpty(sortByValue) && !isStringEmpty(sortOrderValue)) {
            const newSorting = [{
                id: sortByValue,
                desc: sortOrderValue?.toLowerCase() === 'desc'
            }];

            setSorting(newSorting);
        }
    }, [searchParams]);

    return (<div className="chapter-listings">
        <ListingsSearchBar onSearchSubmit={fetchChapters} />
        <table className={styles["table-container"]} cellPadding={0} cellSpacing={0}>
            <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map(header => (
                            <th className={styles["table-head-cell"]} key={header.id}>
                                {header.isPlaceholder ? null : (
                                    <button
                                        className={
                                            header.column.getCanSort()
                                                ? 'cursor-pointer select-none'
                                                : ''
                                        }
                                        onClick={header.column.getToggleSortingHandler()}
                                        title={
                                            header.column.getCanSort()
                                                ? (() => {
                                                    const nextOrder = header.column.getNextSortingOrder();
                                                    return getSortDirectionTitle(nextOrder);
                                                })()
                                                : undefined
                                        }
                                    >

                                        {flexRender(
                                            header.column.columnDef.header,
                                            header.getContext()
                                        )}
                                        {
                                            {
                                                asc: ' 🔼',
                                                desc: ' 🔽',
                                            }[header.column.getIsSorted() as string] ?? null
                                        }
                                    </button>
                                )}
                            </th>
                        ))}
                    </tr>
                ))}
            </thead>
            <tbody>
                {table.getRowModel().rows.map(row => (
                    <tr className={`${styles["table-row"]}`} key={row.id}>
                        {row.getVisibleCells().map(cell => {
                            const tdClass = cell.column.columnDef.meta?.tdClassName
                                ? cell.column.columnDef.meta.tdClassName(cell.getContext())
                                : "";

                            return (<td className={`${styles["table-row-data"]} ${tdClass}`} key={cell.id}>
                                {flexRender(cell.column.columnDef.cell, cell.getContext())}
                            </td>)
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    </div>);
};

export default ResourceChaptersListings;