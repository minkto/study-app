import { Chapter } from "@/shared.types";
import { CellContext, createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, Row, RowData, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './resource-chapters-listings.module.css'
import CardDropdownMenu from "../card-dropdown-menu/CardDropdownMenu";
import { ChapterStatuses, FilterByQueryKeys } from "@/constants/constants";
import ListingsSearchBar from "../listings-search-bar/ListingsSearchBar";
import { getSortDirectionTitle, nullableDateTimeSortingFn } from "@/utils/tableUtils";
import { TZDate } from "@date-fns/tz";
import DashboardModalPortal from "../dashboard-modal-portal/DashboardModalPortal";
import ConfirmationModal from "../modals/confirmation-modal/ConfirmationModal";
import { useModalVisibility } from "@/hooks/useModalVisibility";
import Link from "next/link";
import IconPlus from "../icons/icon-plus/IconPlus";
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";
import ListingsSearchFilterOptions from "../listings-search-filter-options/ListingsSearchFilterOptions";
import { ListingsPagination } from "../listings-pagination/ListingsPagination";

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

    const [data, setData] = useState<Chapter[]>([]);
    const columnHelper = createColumnHelper<Chapter>();
    const [pageCount, setPageCount] = useState(0);
    const [selectedChapter, setSelectedChapter] = useState<Chapter>();
    const { isVisible: deleteModalVisible, toggle: handleModalVisibility, show, hide } = useModalVisibility();
    const { constructQueryString, redirectWithQueryParams, searchParams, sorting, pagination, setPagination, setSorting } = useDataTableQueryParams(process.env.CHAPTERS_MAX_PAGE_SIZE);
    
    const filterQueryParamKeys = [FilterByQueryKeys.ChapterListings.STATUS,FilterByQueryKeys.ChapterListings.DAYS_SINCE_LAST_COMPLETED];
    const filterByList =
    {
        groups:
            [
                {
                    groupId: 0,
                    queryKey: FilterByQueryKeys.ChapterListings.STATUS,
                    title: "Status",
                    options: [
                        { id: 0, label: "Not Started", checked: false },
                        { id: 1, label: "In Progress", checked: false },
                        { id: 2, label: "Completed", checked: false },
                    ],
                    toggled: true
                },

                {
                    groupId: 1,
                    queryKey: FilterByQueryKeys.ChapterListings.DAYS_SINCE_LAST_COMPLETED,
                    title: "Days Since Last Completed",
                    options: [
                        { id: 0, label: "Less Than 10 Days", checked: false },
                        { id: 1, label: "Less Than 20 Days", checked: false },
                        { id: 2, label: "Less Than 30 Days", checked: false },
                        { id: 3, label: "Equal to 30 Days", checked: false },
                        { id: 4, label: "Greater Than 30 Days", checked: false },
                    ],
                    toggled: true
                },

            ]
    };

    const fetchChapters = useCallback(async () => {
        try {

            if (!resourceId) {
                return;
            }

            const response = await fetch(`/api/resources/${resourceId}/chapters${constructQueryString()}`);
            const data = await response.json();
            setData(data.chapters);
            setPageCount(data.chaptersCount);
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
                return date ? new TZDate(date, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString() : null;

            },
            header: () => <span>Original Date Completed</span>,
            enableSorting: true,
            sortingFn: nullableDateTimeSortingFn

        }),
        columnHelper.accessor('lastDateCompleted', {
            id: "lastdatecompleted",
            cell: (info) => {
                const date = info.getValue();
                return date ? new TZDate(date, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString() : null;
            },
            header: () => <span>Last Date Completed</span>,
            enableSorting: true,
            sortingFn: nullableDateTimeSortingFn
        }),
        columnHelper.accessor('daysSinceCompleted', {
            cell: info => info.getValue(),
            header: () => <span>Days Since Last Completed</span>,
            enableSorting: true
        }),
        {
            id: 'menuOptions',
            header: () => null,
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
                                        setSelectedChapter(row.original);
                                        handleModalVisibility();
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
        pageCount,
        state:
        {
            sorting,
            pagination
        },
        manualSorting: true,
        manualPagination: true,
        onSortingChange: setSorting,
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiSort: false,
        enableSortingRemoval: true,
    });

    // Upon Component Mount, fetch the chapters.
    useEffect(() => {
        fetchChapters();
    }, [searchParams]);

    useEffect(() => {
        redirectWithQueryParams();
    }, [sorting, pagination]);


    return (<div className="chapter-listings">
        <DashboardModalPortal show={deleteModalVisible}>
            <ConfirmationModal
                onClose={hide}
                onConfirm={async () => {
                    if (selectedChapter !== undefined) {
                        await deleteChapter(selectedChapter?.chapterId);
                        await fetchChapters();
                    }
                }}
                isActive={deleteModalVisible}
                text={`Are you sure you would like to delete this Chapter?`}
                subText={`${selectedChapter?.name}`}
                confirmText="Yes, Delete"
                headingText="Delete Chapter"
            />
        </DashboardModalPortal>
        <ListingsSearchBar  onSearchSubmit={() => setPagination({ ...pagination, pageIndex: 0 })}>
            <Link className='dashboard-primary-btn' href={'chapters/add-chapter'}><IconPlus width={24} height={24} />Add</Link>
            <ListingsSearchFilterOptions onFilterChange={() => {table.firstPage();}}  filterQueryKeys={filterQueryParamKeys} filterGroups={filterByList} />
        </ListingsSearchBar>

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
            <ListingsPagination table={table} />
    </div>);
};

export default ResourceChaptersListings;