import { getChapterDetails } from "@/services/chaptersService";
import { Chapter } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import Link from "next/link";
import styles from './page.module.css'
import ProgressPill from "@/components/resource-chapters-listings/ProgressPill";
import { ChapterStatuses } from "@/constants/constants";
import ChapterDaysCompletedPill from "@/components/resource-chapters-listings/ChapterDaysCompletedPill";
import { TZDate } from "@date-fns/tz";
import IconExternalLink from "@/components/icons/icon-external-link/IconExternalLink";
import AddNoteLink from "@/components/add-note-link/AddNoteLink";
import NotesCardListings from "@/components/notes-card-listings/NotesCardListings";


export default async function Page({ params }: { params: Promise<{ "chapter-id": string }> }) {

    const loadChapterDetails = async (chapterId: number, userId: string | null): Promise<Chapter | null> => {
        try {

            if (userId === null || userId === undefined) {
                throw new Error("User ID is null or undefined.");
            }

            const chapterDetails = await getChapterDetails(chapterId, userId);
            return chapterDetails;

        } catch (error) {
            console.error('Error fetching chapter details:', error);
            return null;
        }
    };

    const { "chapter-id": chapterId } = await params;
    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const chapterDetails = await loadChapterDetails(Number(chapterId), userId);


    return (<>
        {chapterDetails && (
            <div className={styles["chapter-info"]}>
                <h2 className={styles["chapter-info__title"]}>{chapterDetails.name}</h2>

                <div className={styles["chapter-info-wrapper"]}>
                    <div className={styles["chapter-info__left-side"]}>

                        <div className={styles["chapter-info__block"]}>
                            <p className={styles["chapter-info__label"]}>Status</p>
                            <ProgressPill statusId={chapterDetails.statusId ?? ChapterStatuses.NOT_STARTED} />
                        </div>

                        <div className={styles["chapter-info__block"]}>
                            <p className={styles["chapter-info__label"]}>Last Reviewed</p>
                            <ChapterDaysCompletedPill days={chapterDetails.daysSinceCompleted ?? 0} />
                        </div>

                        <div className={styles["chapter-info__block"]}>
                            <p className={styles["chapter-info__label"]}>Original Date Completed</p>
                            <p className="chapter-info__original-date-completed">
                                {chapterDetails?.originalDateCompleted ? new TZDate(chapterDetails?.originalDateCompleted, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        <div className={styles["chapter-info__block"]}>
                            <p className={styles["chapter-info__label"]}>Last Completed</p>
                            <p className="chapter-info__last-date-completed">
                                {chapterDetails?.lastDateCompleted ? new TZDate(chapterDetails?.lastDateCompleted, Intl.DateTimeFormat().resolvedOptions().timeZone).toLocaleDateString()
                                    : "-"}
                            </p>
                        </div>

                        {chapterDetails?.url && (
                            <div>
                                <Link className={`dashboard-primary-btn ${styles["chapter-info__external-link"]}`} href={chapterDetails?.url} target="_blank" >
                                    <IconExternalLink className={styles["external-link-icon"]} width={32} height={32} />
                                    View Page</Link>
                            </div>)}
                    </div>
                    <div className={styles["chapter-info__right-side"]}>
                        <p className="chapter-info__description">{chapterDetails.description}</p>
                    </div>
                </div>
                <h2 className={styles["chapter-info__title"]}>Notes</h2>
                <AddNoteLink />

                {chapterDetails?.notes && <NotesCardListings notes={chapterDetails.notes}/>}

            </div>)}
    </>)
}