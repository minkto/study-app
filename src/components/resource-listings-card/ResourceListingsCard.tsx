import CategoryPill from '../category-pill/CategoryPill';
import styles from './resource-listings-card.module.css'
import CardDropdownMenu from '../card-dropdown-menu/CardDropdownMenu';
import { Resource } from '@/shared.types';

interface ResourceListingsCardProps {
    resource: Resource;
    onDelete:  (id: number | undefined) => Promise<void>;
}

const ResourceListingsCard = ({resource, onDelete}: ResourceListingsCardProps) => {

    return (
        <div className={styles["resources-listing-card"]}>
            <div className={styles["resources-listing-card__row"]}>
                <h2 className={styles["resources-listing-card__name"]}>{resource.name}</h2>
                    {<CardDropdownMenu links={ 
                        [
                            {href : `resources/${resource.resourceId}/chapters`, label: "View Chapters"},
                            {href : `resources/${resource.resourceId}/edit-resource`, label: "Edit Resource"},
                            {onClick: () => onDelete(resource.resourceId), label: "Delete Resource"},
                        ]
                    }/>}
            </div>

            <div className={styles["resources-listing-card__row"]}>
                {/*<!-- Percentage Component -->*/}
                <div className={styles["resources-listing-card__progress-bar"]}>
                    <div className={styles["resources-listing-card__progress-bar__name"]}>Percentage Reviewed</div>
                    <div className={styles["resources-listing-card__progress-bar__image"]}></div>
                </div>
            </div>
            <div className={styles["resources-listing-card__row"]}>
                <div className={styles["resources-listing-card__category"]}>
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                    <CategoryPill />
                </div>
            </div>
            <div className={styles["resources-listing-card__description"]}>
                <p className={styles["max-lines"]}>{resource?.description}</p>
                <div className={styles["resources-listing-card__description-container"]}></div>
            </div>

            <div className={styles["resources-listing-card__description-overlay"]}></div>
        </div>
    );
}

export default ResourceListingsCard;