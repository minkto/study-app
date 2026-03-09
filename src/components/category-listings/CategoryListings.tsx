'use client'

import Link from "next/link";
import ListingsSearchBar from "../listings-search-bar/ListingsSearchBar"
import IconPlus from "../icons/icon-plus/IconPlus";
import { useEffect, useMemo, useState } from "react";
import { ListingPageSizes } from "@/constants/constants";
import { Category } from "@/shared.types";
import { createColumnHelper, flexRender, getCoreRowModel, getPaginationRowModel, Row, useReactTable } from "@tanstack/react-table";
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";
import { isStringEmpty } from "@/utils/stringUtils";
import Skeleton from "react-loading-skeleton";
import { getCurrentSortOrder, getInitialSortByOption, getSortDirectionTitle } from "@/utils/tableUtils";
import CardDropdownMenu from "../card-dropdown-menu/CardDropdownMenu";
import SelectDropdown from "../select-dropdown/SelectDropdown";
import { ListingsPagination } from "../listings-pagination/ListingsPagination";
import ListingsNoResults from "../listings-no-results/ListingsNoResults";


export const CategoryListings = () => {

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const { setSorting, setPagination, sorting, pagination, constructQueryString, redirectWithQueryParams, searchParams } = useDataTableQueryParams(process.env.RESOURCES_MAX_PAGE_SIZE ?? ListingPageSizes.DEFAULT);
    const [pageCount, setPageCount] = useState(0);
    const [data, setData] = useState<Category[]>([]);
    const columnHelper = createColumnHelper<Category>();
    const sortByOptions =
        [
            { label: "Sort By", value: "none" },
            { label: "Name - Asc", value: "name-asc" },
            { label: "Name - Desc", value: "name-desc" },
        ];

    const columns = useMemo(() => [
        columnHelper.accessor('name', {
            cell: info => info.getValue(),
            header: () => <span>Name</span>
        }),
        columnHelper.accessor('description', {
            cell: info => info.getValue(),
            header: () => <span>Description</span>
        }),
        columnHelper.accessor('color', {
            cell: ({ row }: { row: Row<Category> }) => {
                const color = row.original.color;
                return (
                    <div style={{
                        backgroundColor: `${color}`,
                        opacity: `1`, width: `25px`,
                        borderRadius: `50%`,
                        border: `1px solid #000000`,
                        height: `25px`,
                        margin: `0 auto`
                    }}>
                    </div>
                )
            },

            header: () => <span>Color</span>,
            enableSorting: false,
            enableHiding: false,
        }),
        {
            id: 'menuOptions',
            header: () => null,
            cell: ({ row }: { row: Row<Category> }) => {
                const categoryId = row.original.categoryId
                return (
                    <CardDropdownMenu positionCenter={true} links={
                        [
                            { label: "Edit", href: `categories/${categoryId}/edit-category` },
                            {
                                label: "Delete",
                                onClick: async () => {
                                    try {
                                        //setSelectedChapter(row.original);
                                        //handleModalVisibility();
                                    } catch (error) {
                                        console.error("Failed to delete chapter:", error);
                                    }
                                },
                            }
                        ]
                    } />
                )
            },

            meta: {
                tdClassName: () => "col-menu",
                thClassName: "col-menu",
            },
            enableSorting: false,
            enableHiding: false,
        },
    ], [columnHelper]);

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

    const fetchCateogries = async () => {
        try {
            setupLoading(true);
            const response = await fetch(`/api/categories${constructQueryString()}`);
            const result = await response.json();

            setData(result.categories);
            setPageCount(result.count);
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
        finally {
            setupLoading(false);
        }
    }

    useEffect(() => {
        fetchCateogries();
    }, [searchParams])



    useEffect(() => {
        redirectWithQueryParams();
    }, [sorting, pagination]);

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
        <div className="data-table-listings">
            <ListingsSearchBar 
             handleBeforeOnSearchSubmit={() => { setupLoading(true); }}
                onSearchSubmit={() => { setPagination({ ...pagination, pageIndex: 0 }) }}>
                <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24} />Add</Link>


                <SelectDropdown
                    getDefaultValue={() => getInitialSortByOption(sorting)}
                    onChangeCallback={(e) => { setupLoading(true); setSorting(getCurrentSortOrder(e)); }}
                    dropdownOptions={sortByOptions} />
            </ListingsSearchBar>
            {data?.length === 0 && (dataLoaded && !isLoading) ? <ListingsNoResults />
                : <table className="table-container" cellPadding={0} cellSpacing={0}>
                    <thead>
                        {table.getHeaderGroups().map(headerGroup => (
                            <tr key={headerGroup.id}>
                                {headerGroup.headers.map(header => {
                                    const thClass = header.column.columnDef.meta?.thClassName;
                                    return (
                                        <th className={`table-head-cell ${thClass ?? ""}`} key={header.id}>

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
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </button>
                                            )}
                                        </th>
                                    )
                                }
                                )}
                            </tr>
                        ))}
                    </thead>
                    <tbody>
                        {!dataLoaded ? (
                            // Skeleton rows
                            [...Array(Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES))].map((_, i) => (
                                <tr className="table-row" key={`skeleton-${i}`}>
                                    {table.getVisibleFlatColumns().map((col, j) => (
                                        <td className="table-row-data" key={`skeleton-cell-${j}`}>
                                            <div style={{ width: '100%' }}>
                                                <Skeleton height={(Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.DEFAULT))} />
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            ))
                        ) : (
                            // Actual rows
                            table.getRowModel().rows.map(row => (
                                <tr className="table-row" key={row.id}>
                                    {row.getVisibleCells().map(cell => {
                                        const tdClass = cell.column.columnDef.meta?.tdClassName
                                            ? cell.column.columnDef.meta.tdClassName(cell.getContext())
                                            : "";

                                        const label = cell.column.columnDef.meta?.label
                                            ? `${cell.column.columnDef.meta.label}`
                                            : "";

                                        const value = cell.getValue() as string;

                                        return (
                                            <td
                                                className={`table-row-data ${tdClass ?? null}`}
                                                key={cell.id}
                                            >
                                                {!isStringEmpty(value) ? (<span className={"col-label-inline"}>{label}</span>) : (null)}

                                                <span>

                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>}
            <ListingsPagination handleBeforeButtonClick={() => setupLoading(true)} table={table} />

        </div>

    )
}

export default CategoryListings