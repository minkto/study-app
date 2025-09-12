import { ProgressItem } from '@/shared.types';
import styles from './dashboard-progress-card.module.css'

interface DashboardProgressCardProps {
    title: string;
    subTitle?: string;
    items: ProgressItem[];
    prefixLabel?: string;
    postfixLabel?: string;
    alternativeColors?: boolean;
}


const DashboardProgressCard = ({ title, subTitle, items, prefixLabel = "", postfixLabel = "", alternativeColors }: DashboardProgressCardProps) => {
    const getProgressBarColor = (colorIndex: number) => {
        const ProgressBarColors =
        {
            RED: '#FF8989',
            GREEN: '#B1FFC5',
            BLUE: '#89EDFF',
            YELLOW: '#F1F150',
        }

        if (!alternativeColors) {
            return ProgressBarColors.GREEN;
        }

        switch (colorIndex) {
            case 0:
                return ProgressBarColors.RED;
            case 1:
                return ProgressBarColors.GREEN;
            case 2:
                return ProgressBarColors.BLUE;
            case 3:
                return ProgressBarColors.YELLOW;
            default:
                return ProgressBarColors.GREEN;
        }
    }

    const renderProgressBars = (p: ProgressItem, index: number) => {
        const color = getProgressBarColor(index);

        return <div className={styles["dashboard-progress-item-bar"]} >
            <div style={{ backgroundColor: color ?? '', width: `${p.numberValue}%` }} className={styles["dashboard-progress-item-bar__overlay"]}></div>
        </div>
    }

    return <div className={`${styles["dashboard-progress-card"]}`}>
        <div className={styles["dashboard-progress-card__title"]}>
            <h4>{title}</h4>
        </div>
        <div className={styles["dashboard-progress-card__sub-title"]}>
            <h4>{subTitle}</h4>
        </div>

        <div className={styles["dashboard-progress-item-list"]}>
            {items.map((p, index) => (
                <div className={styles["dashboard-progress-item"]} key={index}>
                    <div className={styles["dashboard-progress-item-container"]}>
                        <p className={styles["dashboard-progress-item__name"]}>{p.name}</p>
                        <p className={styles["dashboard-progress-item__number-value"]}>{`${prefixLabel}${p.numberValue}${postfixLabel}`}</p>
                    </div>
                    {renderProgressBars(p, index)}
                </div>
            ))}
        </div>
    </div>
}

export default DashboardProgressCard;