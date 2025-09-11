import { ProgressItem } from '@/shared.types';
import styles from './dashboard-progress-card.module.css'

interface DashboardProgressCardProps {
    title: string;
    items: ProgressItem[];
}


const DashboardProgressCard = ({ title, items }: DashboardProgressCardProps) => {
    return <div className={`${styles["dashboard-progress-card"]}`}>
        <div className={styles["dashboard-progress-card__title"]}>
            <h4>{title}</h4>
        </div>

        <div className={styles["dashboard-progress-item-list"]}>
            {items.map((p, index) => (
                <div className={styles["dashboard-progress-item"]} key={index}>
                    <div className={styles["dashboard-progress-item-container"]}>
                        <p className={styles["dashboard-progress-item__name"]}>{p.name}</p>
                        <p className={styles["dashboard-progress-item__percentage"]}>{p.percentage}%</p>
                    </div>
                    <div className={styles["dashboard-progress-item-bar"]}>
                        <div style={{ width: `${p.percentage}%` }} className={styles["dashboard-progress-item-bar__overlay"]}></div>
                    </div>
                </div>

            ))}
        </div>
    </div>
}

export default DashboardProgressCard;