import { GetResourceDto } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'
import { useCallback, useEffect, useState } from 'react';
import { createColumnHelper, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import ListingsSearchBar from '../listings-search-bar/ListingsSearchBar';
import Link from 'next/link';
import IconPlus from '../icons/icon-plus/IconPlus';
import { useDataTableQueryParams } from "@/hooks/useDataTableQueryParams";

const ResourceListings = () => {

  const { sorting, constructQueryString } = useDataTableQueryParams();

  const [data, setData] = useState<GetResourceDto[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const columnHelper = createColumnHelper<GetResourceDto>();

  const columns = [
    columnHelper.accessor('name', {
      cell: info => info.getValue(),
      header: () => <span>Name</span>
    }),
    columnHelper.accessor('categoryId', {
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

  useEffect(() => {
    getResources();
  }, [getResources]);


  return loading ? <p>Loading...</p> : (

    <div className={styles["resources-listing-wrapper"]}>
      <ListingsSearchBar>
        <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24} />Add</Link>
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