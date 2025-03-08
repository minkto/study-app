import { Resource } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'
import { useEffect, useState } from 'react';

const ResourceListings = () => {

  const [resources, setResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  const getResources = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/resources');

      if (!response.ok) {
        throw new Error(`Failed to fetch resources: ${response.status}`);
      }
      const data = await response.json();
      setResources(data);

    } catch (error) {
      console.error("An error has occurred while getting the resources: ", error);
    } finally {
      setLoading(false);
    }
  };

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
  }, [])

  return loading ? <p>Loading...</p> : (<div className={styles["resources-listing"]}>
    {resources?.map(r => <ResourceListingsCard onDelete={deleteResource} key={r.resourceId} resource={r} />)}
  </div>)
}

export default ResourceListings;