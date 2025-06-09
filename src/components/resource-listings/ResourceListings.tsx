import { GetResourceDto } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'
import { ChangeEvent, useCallback, useEffect, useState } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import ListingsSearchBar from '../listings-search-bar/ListingsSearchBar';
import Link from 'next/link';
import IconPlus from '../icons/icon-plus/IconPlus';
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";
import SelectDropdown from '../select-dropdown/SelectDropdown';

const ResourceListings = () => {

  const { setSorting, sorting, constructQueryString, redirectWithQueryParams } = useDataTableQueryParams();
  const [data, setData] = useState<GetResourceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const columnHelper = createColumnHelper<GetResourceDto>();
  const sortByOptions =
    [
      { label: "Sort By", value: "none" },
      { label: "Name A-Z", value: "name-asc" },
      { label: "Name Z-A", value: "name-desc" },
      { label: "Category A-Z", value: "categoryName-asc" },
      { label: "Category Z-A", value: "categoryName-desc" },
    ];

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
    columns,
    data,
    enableMultiSort: false,
    state:
    {
      sorting
    },
    getCoreRowModel: getCoreRowModel(),
  });

  const getResources = useCallback(async () => {
    setLoading(true);
    try {
      const queryString = constructQueryString();
      const response = await fetch(`/api/resources${queryString}`);

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      const data = await response.json();
      setData(data);

    } catch (error) {
      console.error("An error has occurred while getting the resources: ", error);
    } finally {
      setLoading(false);
    }
  }, [constructQueryString]);

  const deleteResource = async (id: number | undefined): Promise<void> => {
    setLoading(true);
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
      setLoading(false);
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
  }, [sorting]);

  useEffect(() => {
    redirectWithQueryParams();
  }, [sorting]);

  return loading ? <p>Loading...</p> : (

    <div className={styles["resources-listing-wrapper"]}>
      <ListingsSearchBar onSearchSubmit={getResources}>
        <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24} />Add</Link>
        <SelectDropdown getDefaultValue={getInitialSortByOption} onChangeCallback={setSortOrder} dropdownOptions={sortByOptions} ></SelectDropdown>
      </ListingsSearchBar>

      <div className={styles["resources-listing"]}>
        {table.getRowModel().rows.map(r => (
          <ResourceListingsCard
            onDelete={deleteResource}
            key={r.original.resourceId}
            resource={r.original} />)
        )}
      </div>
    </div>)
}

export default ResourceListings;