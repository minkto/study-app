import { ListItem } from '@/shared.types';
import styles from './dashboard-list-card.module.css'

interface DashboardListCardProps {
    title: string;
    subTitle?: string;
    items: ListItem[];
    prefixLabel?: string;
    postfixLabel?: string;
}


const DashboardListCard = ({ title, subTitle, items, prefixLabel = "", postfixLabel = "" }: DashboardListCardProps) => {
    return <div className={`${styles["dashboard-list-card"]}`}>
        <div className={styles["dashboard-list-card__title"]}>
            <h4>{title}</h4>
        </div>
        <div className={styles["dashboard-list-card__sub-title"]}>
            <h4>{subTitle}</h4>
        </div>

        <div className={styles["dashboard-list-item-list"]}>
            {items.map((p, index) => (
                <div className={styles["dashboard-list-item"]} key={index}>
                    <div className={styles["dashboard-list-item-container"]}>
                        <div className={styles["dashboard-list-item-details"]}>
                            <p className={styles["dashboard-list-item__title"]}>{p.title}</p>
                            <p className={styles["dashboard-list-item__sub-title"]}>{p.subTitle}</p>
                        </div>
                        <p className={styles["dashboard-list-item__value"]}>{`${prefixLabel}${p.value}${postfixLabel}`}</p>
                    </div>
                </div>
            ))}
        </div>
    </div>
}

export default DashboardListCard;