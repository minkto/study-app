import { ChapterStatuses } from "@/constants/constants";
import { Chapter } from "@/shared.types";
import styles from './chapters-data-table-card-view.module.css'
import { TZDate } from "@date-fns/tz";
import { ProgressPill } from "./ProgressPill";
import IconClock from "../icons/icon-clock/IconClock";

interface ChaptersDataTableProps {
    chapter: Chapter;
    cardMenuOption: React.ReactNode
}

const ChaptersDataTableCardView = ({ chapter, cardMenuOption }: ChaptersDataTableProps) => {

    return (
        <div className={styles["chapter-data-table-card"]}>
            <div className={styles["chapter-data-table-card__header"]}>
                <span className={styles["chapter-data-table-card__header-title"]}>{chapter.name}</span>
                {cardMenuOption}
            </div>
            <ProgressPill statusId={chapter.statusId ?? ChapterStatuses.NOT_STARTED}/>
            <div className={styles["chapter-data-table-card__completion"]}>
                
                <div className={`${styles["chapter-data-table-card__completion-section"]}`}>
                    <p>Last Reviewed</p> 
                    <div className={styles["chapter-data-table-card__days-completed"]}>
                        <IconClock className={styles["chapter-data-table-card__days-completed-icon"]} width={32} height={32}/>
                        <div >{chapter.daysSinceCompleted} Day(s)</div>
                    </div>

                </div>

                <div className={`${styles["chapter-data-table-card__completion-section"]} ${styles["chapter-data-table-card__first-completed"]}`}>
                    <p>First Completed</p>
                    {chapter?.originalDateCompleted ? new TZDate(chapter?.originalDateCompleted, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString()
                        : "-"}
                </div>

                <div className={styles["chapter-data-table-card__completion-section"]}>
                    <p>Last Completed</p>
                    {chapter?.lastDateCompleted ? new TZDate(chapter?.lastDateCompleted, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString()
                        : "-"}
                </div>
            </div>
        </div>
    )
}

export default ChaptersDataTableCardView;