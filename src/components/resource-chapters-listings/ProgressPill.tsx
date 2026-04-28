import { ChapterStatuses } from "@/constants/constants";
import styles from './progress-pill.module.css'

interface ProgressPillProps {
    statusId: number
}

export const ProgressPill = ({ statusId = ChapterStatuses.NOT_STARTED }: ProgressPillProps) => {

    const statusMapping = {
        [ChapterStatuses.NOT_STARTED]: { text: "Not Started", class: "--not-started" },
        [ChapterStatuses.IN_PROGRESS]: { text: "In Progress", class: "--in-progress" },
        [ChapterStatuses.COMPLETED]: { text: "Completed", class: "--completed" },
    };

    const status = statusMapping[statusId ?? ChapterStatuses.NOT_STARTED] || { text: "Unknown", class: "progress--unknown" };
    const progressPillClassName = `${styles["progress-pill"]} ${styles["progress-pill" + statusMapping[statusId ?? ChapterStatuses.NOT_STARTED].class || "progress--unknown"]}`;
    const progessPillCircleClassName = `${styles["progress-pill__circle"]} ${styles["progress-pill__circle" + statusMapping[statusId ?? ChapterStatuses.NOT_STARTED].class || "progress--unknown"]}`

    return (<div className={`${progressPillClassName}`}>
        <div className={`${progessPillCircleClassName}`} ></div>
        <div>{status.text}
        </div>
    </div>)
}

export default ProgressPill;