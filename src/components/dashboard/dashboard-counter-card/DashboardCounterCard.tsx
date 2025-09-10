import styles from './dashboard-counter-card.module.css'

interface DashboardCounterCardProps {
    title: string;
    count?: number | undefined;
    subHeading: string;
}

const DashboardCounterCard = ({ title, count = 0, subHeading }: DashboardCounterCardProps) => {
    
    return <div className={`${styles["dashboard-counter-card"]}`}>
        <div className={styles["dashboard-counter-card__title"]}>
            <h4>{title}</h4>
        </div>
        <div className={styles["dashboard-counter-card__count"]}>
            <h2>{count}</h2>
        </div>
        <div className={styles["dashboard-counter-card__sub-heading"]}>
            <h4>{subHeading}</h4>
        </div>
    </div>
}

export default DashboardCounterCard;