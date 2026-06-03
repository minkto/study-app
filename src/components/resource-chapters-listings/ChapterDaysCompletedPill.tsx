import styles from "./chapter-days-completed.module.css";
import IconClock from "../icons/icon-clock/IconClock";

const ChapterDaysCompletedPill = ({ days }: { days: number }) => {
    return (
        <div className={`${styles["chapter-days-complete-pill__completion-section"]}`}>
            <div className={styles["chapter-days-complete-pill__days-completed"]}>
                <IconClock className={styles["chapter-days-complete-pill__days-completed-icon"]} width={32} height={32} />
                <div >{days} Day(s)</div>
            </div>
        </div>)
}

export default ChapterDaysCompletedPill;