import { GetResourceDto } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
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

const ResourceListings = () => {

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [dataLoaded, setDataLoaded] = useState<boolean>(false);
  const { setSorting, setPagination, sorting, pagination, constructQueryString, redirectWithQueryParams, searchParams } = useDataTableQueryParams(process.env.RESOURCES_MAX_PAGE_SIZE ?? ListingPageSizes.RESOURCES);
  const [pageCount, setPageCount] = useState(0);
  const [data, setData] = useState<GetResourceDto[]>([]);
  const columnHelper = createColumnHelper<GetResourceDto>();
  const sortByOptions =
    [
      { label: "Sort By", value: "none" },
      { label: "Name A-Z", value: "name-asc" },
      { label: "Name Z-A", value: "name-desc" },
      { label: "Category A-Z", value: "categoryName-asc" },
      { label: "Category Z-A", value: "categoryName-desc" },
    ];

  const filterQueryParamKeys = [FilterByQueryKeys.ResourceListings.CATEGORY];
  const filterByList =
  {
    groups:
      [
        {
          groupId: 0,
          queryKey: "Category",
          title: "Category",
          options: [
            { id: 0, label: "C#", checked: false },
            { id: 1, label: "SQL", checked: false },
          ],
          toggled: true
        },

      ]
  };

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
  
  const getResources = useCallback(async () => {
    setupLoading(true);
    try {
      const queryString = constructQueryString();
      const response = await fetch(`/api/resources${queryString}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      const data = await response.json();
      setData(data.resources);
      setPageCount(data.pageCount);

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

  const setSortOrder = (e: ChangeEvent<HTMLSelectElement>) => {
    const fullSelectValue = e.target.value;
    if (fullSelectValue !== "none") {
      const sortValue = fullSelectValue.split("-");
      setSorting([{ id: sortValue[0], desc: (sortValue[1]?.toLowerCase() === 'desc') }])
    }
    else {
      setSorting([]);
    }
  }

  const getInitialSortByOption = () => {
    if (sorting.length > 0) {
      const sortBy = sorting[0].id;
      const sortOrder = sorting[0].desc ? "desc" : "asc";
      return (`${sortBy}-${sortOrder}`);
    } else {
      return ('none');
    }
  }

  useEffect(() => {
    getResources();
  }, [searchParams]);

  useEffect(() => {
    redirectWithQueryParams();
  }, [sorting, pagination.pageIndex]);

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
      <ListingsSearchBar handleBeforeOnSearchSubmit={() => { setupLoading(true) }} onSearchSubmit={() => { table.firstPage(); }}>
        <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24} />Add</Link>
        <ListingsSearchFilterOptions
          handleBeforeOnFilterChange={() => setupLoading(true)}
          onFilterChange={() => { table.firstPage(); }}
          filterQueryKeys={filterQueryParamKeys}
          filterGroups={filterByList} />

        <SelectDropdown
          getDefaultValue={getInitialSortByOption}
          onChangeCallback={(e) => { setupLoading(true); setSortOrder(e); }}
          dropdownOptions={sortByOptions} />
      </ListingsSearchBar>

      <div className={styles["resources-listing"]}>
        {!dataLoaded ? (
          <ResourceListingsCardSkeleton count={3} />
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
      <ListingsPagination handleBeforeButtonClick={() => setupLoading(true)} table={table} />
    </div>)
}

export default ResourceListings;