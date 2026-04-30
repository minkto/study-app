"use client"

import { Chapter } from "@/shared.types";
import { CellContext, createColumnHelper, getCoreRowModel, getPaginationRowModel, Row, RowData, useReactTable } from "@tanstack/react-table";
import { useCallback, useEffect, useMemo, useState } from "react";
import styles from './resource-chapters-listings.module.css'
import CardDropdownMenu from "../card-dropdown-menu/CardDropdownMenu";
import { ChapterStatuses, FilterByQueryKeys } from "@/constants/constants";
import ListingsSearchBar from "../listings-search-bar/ListingsSearchBar";
import { getCurrentSortOrder, getInitialSortByOption, nullableDateTimeSortingFn } from "@/utils/tableUtils";
import { TZDate } from "@date-fns/tz";
import DashboardModalPortal from "../dashboard-modal-portal/DashboardModalPortal";
import ConfirmationModal from "../modals/confirmation-modal/ConfirmationModal";
import { useModalVisibility } from "@/hooks/useModalVisibility";
import Link from "next/link";
import IconPlus from "../icons/icon-plus/IconPlus";
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";
import ListingsSearchFilterOptions from "../listings-search-filter-options/ListingsSearchFilterOptions";
import { ListingsPagination } from "../listings-pagination/ListingsPagination";
import SelectDropdown from "../select-dropdown/SelectDropdown";
import { useMobileScreenSize } from "@/hooks/useMobileScreenSize";
import ListingsNoResults from "../listings-no-results/ListingsNoResults";
import ChaptersDataTableListView from "./ChaptersDataTableListView";
import ChaptersDataTableCardView from "./ChaptersDataTableCardView";
import ProgressPill from "./ProgressPill";

declare module '@tanstack/react-table' {
    interface ColumnMeta<TData extends RowData, TValue> {
        tdClassName?: (cell: CellContext<TData, TValue>) => string;
        thClassName?: string;
        label?: string;
    }
};

interface ResourceChaptersListingsProps {
    resourceId?: string;
    useQueryParams?: boolean; // If true, use query param hook; else use local state
    pageSize?: number;
}

const sortByOptions =
    [
        { label: "Sort By", value: "none" },
        { label: "Name - Asc", value: "name-asc" },
        { label: "Name - Desc", value: "name-desc" },
        { label: "Status - Asc", value: "statusId-asc" },
        { label: "Status - Desc", value: "statusId-desc" },
        { label: "Original Date Completed - Asc", value: "originaldatecompleted-asc" },
        { label: "Original Date Completed - Desc", value: "originaldatecompleted-desc" },
        { label: "Last Date Completed - Asc", value: "lastdatecompleted-asc" },
        { label: "Last Date Completed - Desc", value: "lastdatecompleted-desc" },
        { label: "Days Since Last Completed - Asc", value: "daysSinceCompleted-asc" },
        { label: "Days Since Last Completed - Desc", value: "daysSinceCompleted-desc" },
    ];


const ResourceChaptersListings = ({ resourceId, useQueryParams = true, pageSize }: ResourceChaptersListingsProps) => {
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const isMobileScreen = useMobileScreenSize();
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const [data, setData] = useState<Chapter[]>([]);
    const columnHelper = createColumnHelper<Chapter>();
    const [pageCount, setPageCount] = useState(0);
    const [selectedChapter, setSelectedChapter] = useState<Chapter>();
    const { isVisible: deleteModalVisible, toggle: handleModalVisibility, hide } = useModalVisibility();
    const { constructQueryString, redirectWithQueryParams, search, submitSearch, searchParams, sorting, pagination, setPagination, setSorting, submitFilters, queryFilters } = useDataTableQueryParams({ pageSize: pageSize, syncWithQueryParams: useQueryParams });

    const filterQueryParamKeys = [FilterByQueryKeys.ChapterListings.STATUS, FilterByQueryKeys.ChapterListings.DAYS_SINCE_LAST_COMPLETED];
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

    const setupLoading = (load: boolean) => {

        if (load) {
            setIsLoading(true);
            setDataLoaded(false);
        }

        else {
            setIsLoading(false);
            setDataLoaded(true);
        }
    }

    const fetchChapters = useCallback(async () => {
        try {

            setupLoading(true);

            if (!resourceId) {
                return;
            }

            const fullQuery = constructQueryString();
            const response = await fetch(`/api/resources/${resourceId}/chapters${fullQuery}`);
            const data = await response.json();
            setData(data.chapters);
            setPageCount(data.chaptersCount);
        } catch (error) {
            console.error("Error fetching chapters:", error);
        }
        finally {
            setupLoading(false);
        }
    }, [resourceId, constructQueryString]);

    const deleteChapter = useCallback(async (chapterId: number | undefined) => {
        try {
            setupLoading(true);
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
        finally {
            setupLoading(false);
        }
    }, [resourceId]);


    const renderChapterOptionMenu = useCallback((chapter: Chapter) => {
        return (<CardDropdownMenu positionCenter={true} links={
            [
                { label: "Edit Chapter", href: `/dashboard/resources/${resourceId}/chapters/${chapter.chapterId}/edit-chapter` },
                {
                    label: "Delete Chapter",
                    onClick: async () => {
                        try {
                            setSelectedChapter(chapter);
                            handleModalVisibility();
                        } catch (error) {
                            console.error("Failed to delete chapter:", error);
                        }
                    },
                }
            ]
        } />)
    }, [handleModalVisibility, resourceId])

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
            enableSorting: true,
            meta: {
                tdClassName: () => styles["col-name"],
                thClassName: styles["col-name"]
            }
        }),
        columnHelper.accessor('statusId', {
            cell: (info) => {
                const value = info.getValue();
                return <ProgressPill statusId={value ?? ChapterStatuses.NOT_STARTED} />
            },
            header: () => <span>Status</span>,
            meta: {
                label: "Status"
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
            meta: {
                tdClassName: () => styles["col-date"],
                thClassName: styles["col-date"],
                label: "Original Date Completed"
            },
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
            meta: {
                tdClassName: () => styles["col-date"],
                thClassName: styles["col-date"],
                label: "Last Date Completed"
            },
            enableSorting: true,
            sortingFn: nullableDateTimeSortingFn
        }),
        columnHelper.accessor('daysSinceCompleted', {
            cell: info => info.getValue(),
            header: () => <span>Days Since Last Completed</span>,
            meta: {
                tdClassName: () => styles["col-days"],
                thClassName: styles["col-days"],
                label: "Days Since Last Completed"
            },
            enableSorting: true
        }),
        {
            id: 'menuOptions',
            header: () => null,
            cell: ({ row }: { row: Row<Chapter> }) => {
                const chapter = row.original
                return (renderChapterOptionMenu(chapter)
                )
            },

            meta: {
                tdClassName: () => styles["col-menu"],
                thClassName: styles["col-menu"],
            },
            enableSorting: false,
            enableHiding: false,
        }
    ], [columnHelper, renderChapterOptionMenu]);

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
        onSortingChange: (updater) => {
            setupLoading(true);
            setSorting(updater);
        },
        onPaginationChange: setPagination,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        enableMultiSort: false,
        enableSortingRemoval: true,
    });

    // Upon Component Mount, fetch the chapters. Change upon search params.
    useEffect(() => {
        fetchChapters();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [searchParams]);

    useEffect(() => {
        if (useQueryParams) {
            redirectWithQueryParams();
        } else {
            fetchChapters();
        }
    }, [sorting, pagination, useQueryParams, search, redirectWithQueryParams, fetchChapters, queryFilters]);

    // Set loading to false after data has been loaded and component has re-rendered
    useEffect(() => {
        if (dataLoaded) {
            // Use setTimeout to ensure the render cycle is complete
            setTimeout(() => {
                setIsLoading(false);
            }, 0);
        }
    }, [dataLoaded]);


    return (
        <div className={`${styles["chapter-listings"]}`}>
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
            <ListingsSearchBar
                useQueryParams={useQueryParams}
                handleBeforeOnSearchSubmit={() => { setupLoading(true); }}
                onSearchSubmit={(searchValue: string | undefined) => {
                    submitSearch(searchValue ?? "");
                }}>

                <Link className='dashboard-primary-btn' href={`/dashboard/resources/${resourceId}/chapters/add-chapter`}><IconPlus width={24} height={24} />Add</Link>
                <ListingsSearchFilterOptions useQueryParams={useQueryParams}
                    onFilterChange={(filtersValue: string | undefined) => {
                        submitFilters(filtersValue ?? "")
                    }}
                    handleBeforeOnFilterChange={() => setupLoading(true)}
                    filterQueryKeys={filterQueryParamKeys} filterGroups={filterByList} />
                {isMobileScreen ? <SelectDropdown
                    getDefaultValue={() => getInitialSortByOption(sorting)}
                    onChangeCallback={(e) => { setupLoading(true); setSorting(getCurrentSortOrder(e)); }}
                    dropdownOptions={sortByOptions} /> : null}

            </ListingsSearchBar>

            {data?.length === 0 && (dataLoaded && !isLoading) ? <ListingsNoResults />
                :
                isMobileScreen ?
                    (
                        <div>
                            {table.getRowModel().rows.map(r => (
                                <ChaptersDataTableCardView cardMenuOption={renderChapterOptionMenu(r.original)}
                                    chapter={r.original}
                                    key={r.original.chapterId} />
                            ))}
                        </div>
                    )
                    : <ChaptersDataTableListView table={table} dataLoaded={dataLoaded} />
            }
            <ListingsPagination handleBeforeButtonClick={() => setupLoading(true)} table={table} />
        </div>);
};

export default ResourceChaptersListings;