import { memo } from "react";
import { ChapterStatuses } from "@/constants/constants";
import { Chapter } from "@/shared.types";
import styles from './chapters-data-table-card-view.module.css'
import { TZDate } from "@date-fns/tz";
import { ProgressPill } from "./ProgressPill";
import ChapterDaysCompletedPill from "./ChapterDaysCompletedPill";
import CardDropdownMenu, { CardDropdownAlignment } from "../card-dropdown-menu/CardDropdownMenu";

interface ChaptersDataTableProps {
    chapter: Chapter;
    resourceId?: string;
    onDeleteChapter: (chapter: Chapter) => void;
}

const ChaptersDataTableCardView = memo(({ chapter, resourceId, onDeleteChapter }: ChaptersDataTableProps) => {

    return (
        <div className={styles["chapter-data-table-card"]}>
            <div className={styles["chapter-data-table-card__header"]}>
                <span className={styles["chapter-data-table-card__header-title"]}>{chapter.name}</span>
                <CardDropdownMenu positionState={CardDropdownAlignment.LEFT} links={
                    [
                        { label: "View", href: `/dashboard/resources/${resourceId}/chapters/${chapter.chapterId}` },
                        { label: "Edit", href: `/dashboard/resources/${resourceId}/chapters/${chapter.chapterId}/edit-chapter` },
                        {
                            label: "Delete",
                            onClick: async () => {
                                onDeleteChapter(chapter);
                            },
                        }
                    ]
                } />
            </div>
            <ProgressPill statusId={chapter.statusId ?? ChapterStatuses.NOT_STARTED}/>
            <div className={styles["chapter-data-table-card__completion"]}>
                <p>Last Reviewed</p>
                <ChapterDaysCompletedPill days={chapter.daysSinceCompleted ?? 0}/>
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
});

ChaptersDataTableCardView.displayName = "ChaptersDataTableCardView";

export default ChaptersDataTableCardView;