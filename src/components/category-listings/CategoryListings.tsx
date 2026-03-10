'use client'

import ListingsSearchBar from "../listings-search-bar/ListingsSearchBar"
import IconPlus from "../icons/icon-plus/IconPlus";
import { useEffect, useMemo, useState } from "react";
import { FormState, ListingPageSizes } from "@/constants/constants";
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
import styles from './category-listings.module.css'
import { CategoryForm } from "../category-form/CategoryForm";
import DashboardModalPortal from "../dashboard-modal-portal/DashboardModalPortal";
import ConfirmationModal from "../modals/confirmation-modal/ConfirmationModal";
import { useModalVisibility } from "@/hooks/useModalVisibility";
import { CoreModal } from "../modals/core-modal/CoreModal";

export const CategoryListings = () => {

    const ModalActiveState = useMemo(() => ({
        NONE: 0,
        ADD_OR_EDIT: 1,
        DELETE: 2,
    }), []);
    
    const { isVisible: modalVisible, toggle: handleModalVisibility, hide } = useModalVisibility();

    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [dataLoaded, setDataLoaded] = useState<boolean>(false);
    const { setSorting, setPagination, sorting, pagination, constructQueryString, redirectWithQueryParams, searchParams } = useDataTableQueryParams(process.env.RESOURCES_MAX_PAGE_SIZE ?? ListingPageSizes.DEFAULT);
    const [pageCount, setPageCount] = useState(0);
    const [selectedCategory, setSelectedCategory] = useState<Category>();
    const [activeModal, setActiveModal] = useState<number>(ModalActiveState.NONE);
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
                    <div className={styles["color-cell"]} style={{
                        backgroundColor: `${color}`
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
                return (
                    <CardDropdownMenu positionCenter={true} links={
                        [
                            {
                                label: "Edit",
                                onClick: async () => {
                                    setActiveModal(ModalActiveState.ADD_OR_EDIT);
                                    setSelectedCategory(row.original);
                                    handleModalVisibility();
                                }
                            },
                            {
                                label: "Delete",
                                onClick: async () => {
                                    try {
                                        setActiveModal(ModalActiveState.DELETE);
                                        setSelectedCategory(row.original);
                                        handleModalVisibility();
                                    } catch (error) {
                                        console.error("Failed to delete category:", error);
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
    ], [columnHelper, ModalActiveState, handleModalVisibility]);

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

    const deleteCategory = async (categoryId: number | null | undefined) => {
        setupLoading(true);
        try {
            const response = await fetch(`/api/categories/${categoryId}`, {
                method: 'DELETE'
            });

            if (response.ok) {
                fetchCateogries();
            }
        }
        catch (error) {
            console.log("An error has occured in deleting the Category: ", error);
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

        <div className={styles["data-table-listings"]}>
            <DashboardModalPortal show={modalVisible}>
                <CoreModal onClose={hide} isActive={modalVisible && activeModal == ModalActiveState.ADD_OR_EDIT}>
                    <CategoryForm
                        state={!selectedCategory?.categoryId ? FormState.ADD : FormState.EDIT}
                        onFormSubmit={async () => {
                            hide();
                            await fetchCateogries();
                        }}
                        categoryId={selectedCategory?.categoryId ?? -1} />
                </CoreModal>
                <ConfirmationModal
                    onClose={hide}
                    onConfirm={async () => {
                        if (selectedCategory !== undefined) {
                            await deleteCategory(selectedCategory?.categoryId);
                            await fetchCateogries();
                        }
                    }}
                    isActive={modalVisible && activeModal == ModalActiveState.DELETE}
                    text={`Are you sure you would like to delete this Category?`}
                    subText={`${selectedCategory?.name}`}
                    confirmText="Yes, Delete"
                    headingText="Delete Category"
                />
            </DashboardModalPortal>
            <ListingsSearchBar
                handleBeforeOnSearchSubmit={() => { setupLoading(true); }}
                onSearchSubmit={() => { setPagination({ ...pagination, pageIndex: 0 }) }}>

                <button onClick={() => {
                    setSelectedCategory(undefined);
                    setActiveModal(ModalActiveState.ADD_OR_EDIT);
                    handleModalVisibility();
                }} className='dashboard-primary-btn'>
                    <IconPlus width={24} height={24} />Add
                </button>

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
            {/* <CategoryForm/> */}
        </div>

    )
}

export default CategoryListings