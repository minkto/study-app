import { Resource } from '@/shared.types';
import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'

interface ResourceListingsProps {
  resources?: Array<Resource>
}

const ResourceListings = ({ resources }: ResourceListingsProps) => {
  return (<div className={styles["resources-listing"]}>
    {resources?.map(r => <ResourceListingsCard key={r.resourceId} resource={r} />)}
  </div>);
}

export default ResourceListings;