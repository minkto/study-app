import Skeleton from 'react-loading-skeleton';
import styles from './resource-listings-card-skeleton.module.css'
import 'react-loading-skeleton/dist/skeleton.css';

interface ResourceListingsCardSkeletonProps 
{
    count?: number;
}

const ResourceListingsCardSkeleton = ({count} : ResourceListingsCardSkeletonProps ) => {
    return (
        Array(count).fill(0).map((_, index) =>
            <div key={index} className={styles["resources-listing-card-skeleton"]}>
                <div className={styles["resources-listing-card-skeleton__row"]}>
                    <h2 className={styles["resources-listing-card-skeleton__name"]}>
                        <Skeleton />
                    </h2>
                    <div className={styles["resources-listing-card-skeleton__options"]}>
                        <Skeleton width={50} height={30} />
                    </div>
                </div>
                <div className={styles["resources-listing-card-skeleton__row"]}>
                    <Skeleton width={80} height={30} />
                </div>

                <div className={styles["resources-listing-card-skeleton__column"]}>
                    <Skeleton width={100} height={10} />
                    <Skeleton />
                </div>

                <div className={styles["resources-listing-card-skeleton__description"]}>
                    <p className={styles["max-lines"]}><Skeleton count={3} height={10} /></p>
                    <div className={styles["resources-listing-card-skeleton__description-container"]}></div>
                </div>

            </div>

        )

    )
}

export default ResourceListingsCardSkeleton;