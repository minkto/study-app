import ResourceListingsCard from '../resource-listings-card/ResourceListingsCard';
import styles from './resource-listings.module.css'

const ResourceListings = () => {
    return (<div className={styles["resources-listing"]}>
      <ResourceListingsCard/>
    </div>);
}

export default ResourceListings;