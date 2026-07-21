"use client"

import { Category, FilterGroupList, GetResourceDto } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'
import { useCallback, useEffect, useState } from 'react';
import { createColumnHelper, getCoreRowModel, getPaginationRowModel, useReactTable } from '@tanstack/react-table';
import ListingsSearchBar from '../listings-search-bar/ListingsSearchBar';
import Link from 'next/link';
import IconPlus from '../icons/icon-plus/IconPlus';
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";
import SelectDropdown from '../select-dropdown/SelectDropdown';
import ListingsSearchFilterOptions from '../listings-search-filter-options/ListingsSearchFilterOptions';
import { FilterByQueryKeys, ListingPageSizes } from '@/constants/constants';
import { ListingsPagination } from '../listings-pagination/ListingsPagination';
import ResourceListingsCardSkeleton from '../loaders/skeleton-loaders/ResourceListingsCardSkeleton/ResourceListingsCardSkeleton';
import { getCurrentSortOrder, getInitialSortByOption } from '@/utils/tableUtils';
import ListingsNoResults from '../listings-no-results/ListingsNoResults';

interface ResourceListingsProps {
  useQueryParams?: boolean; // If true, use query param hook; else use local state
  pageSize?: number;
}

const ResourceListings = ({ useQueryParams = true }: ResourceListingsProps) => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const { setSorting, setPagination, sorting, pagination, constructQueryString, redirectWithQueryParams, searchParams, submitSearch,
    search, submitFilters, queryFilters, queryParamsLoaded } = useDataTableQueryParams({ pageSize: Number(process.env.RESOURCES_MAX_PAGE_SIZE) ?? Number(ListingPageSizes.RESOURCES), syncWithQueryParams: useQueryParams });
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState<GetResourceDto[]>([]);
  const columnHelper = createColumnHelper<GetResourceDto>();
  const sortByOptions =
    [
      { label: "Sort By", value: "none" },
      { label: "Name - Asc", value: "name-asc" },
      { label: "Name - Desc", value: "name-desc" },
      { label: "Category - Asc", value: "categoryName-asc" },
      { label: "Category - Desc", value: "categoryName-desc" },
    ];

  const filterQueryParamKeys = [FilterByQueryKeys.ResourceListings.CATEGORY];
  const [categoriesFilterOptions, setCategoriesFilterOptions] = useState<FilterGroupList>({
    groups: [
      {
        groupId: 0,
        queryKey: FilterByQueryKeys.ResourceListings.CATEGORY,
        title: "Category",
        options: [],
        toggled: true,
      },
    ],
  });

  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => <span>Name</span>
    }),
    columnHelper.accessor('categoryName', {
      cell: info => info.getValue(),
      header: () => <span>Category</span>
    })

  ];

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

  const getCategories = useCallback(async () => {
    try {
      const response = await fetch('/api/categories');
      const result = await response.json();
      const categories = result.categories ?? [];

      setCategoriesFilterOptions({
        groups: [
          {
            groupId: 0,
            queryKey: FilterByQueryKeys.ResourceListings.CATEGORY,
            title: "Category",
            options: (categories ?? []).map((category: Category) => ({
              id: category.categoryId ?? 0,
              label: category.name ?? "",
              checked: false,
            })),
            toggled: true,
          },
        ],
      });
    } catch (error) {
      console.error("An error has occurred while getting the categories: ", error);
    }
  }, []);

  const getResources = useCallback(async () => {
    setupLoading(true);
    try {
      const queryString = constructQueryString();
      const response = await fetch(`/api/resources${queryString}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      const result = await response.json();
      setData(result.resources);
      setPageCount(result.pageCount);

    } catch (error) {
      console.error("An error has occurred while getting the resources: ", error);
    } finally {
      setupLoading(false);
    }
  }, [constructQueryString]);

  const deleteResource = async (id: number | undefined): Promise<void> => {
    setupLoading(true);
    try {
      const response = await fetch(`/api/resources/${id}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        getResources();
      }
    }
    catch (error) {
      console.log("An error has occured in deleting the Resource: ", error);
    }
    finally {
      setupLoading(false);
    }
  }

  useEffect(() => {
    getCategories();
  }, [getCategories]);

  useEffect(() => {
    if (!queryParamsLoaded) {
      return;
    }
    getResources();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchParams, queryParamsLoaded]);

  useEffect(() => {
    if (!queryParamsLoaded) {
      return;
    }
    if (useQueryParams) {
      redirectWithQueryParams();
    } else {
      getResources();
    }
  }, [sorting, pagination, useQueryParams, search, redirectWithQueryParams, getResources, queryFilters, queryParamsLoaded]);

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

    <div className={styles["resources-listing-wrapper"]}>
      <ListingsSearchBar
        useQueryParams={useQueryParams}
        handleBeforeOnSearchSubmit={() => { setupLoading(true); }}
        onSearchSubmit={(searchValue: string | undefined) => {
          submitSearch(searchValue ?? "");
        }}>

        <SelectDropdown
          className="table-dropdown-mobile"
          getDefaultValue={() => getInitialSortByOption(sorting)}
          onChangeCallback={(e) => { setupLoading(true); setSorting(getCurrentSortOrder(e)); }}
          dropdownOptions={sortByOptions} />
        <div className="table-btn-list">
          <ListingsSearchFilterOptions
            useQueryParams={useQueryParams}
            onFilterChange={(filtersValue: string | undefined) => {
              submitFilters(filtersValue ?? "")
            }}
            handleBeforeOnFilterChange={() => setupLoading(true)}
            filterQueryKeys={filterQueryParamKeys} filterGroups={categoriesFilterOptions} />
          <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24} />Add</Link>
        </div>
      </ListingsSearchBar>

      {data?.length === 0 && (dataLoaded && !isLoading) ? <ListingsNoResults /> :
        <div className={styles["resources-listing"]}>
          {!dataLoaded ? (
            <ResourceListingsCardSkeleton count={6} />
          ) : (

            table.getRowModel().rows.map(r => (
              <ResourceListingsCard
                onDelete={deleteResource}
                key={r.original.resourceId}
                resource={r.original}
              />
            ))
          )}
        </div>
      }
      <ListingsPagination handleBeforeButtonClick={() => setupLoading(true)} table={table} />
    </div>)
}

export default ResourceListings;