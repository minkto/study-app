import DashboardCounterCard from '@/components/dashboard/dashboard-counter-card/DashboardCounterCard'
import styles from './page.module.css'
import { getChaptersSummary } from '@/services/dashboardStatisticsService';
import { auth } from '@clerk/nextjs/server';
import { isStringEmpty } from '@/utils/stringUtils';
import DashboardProgressCard from '@/components/dashboard/dashboard-progress-card/DashboardProgressCard';

export default async function Page() {
    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const summary = await getChaptersSummary(userId);

    const renderMediumCard = (text: string) => {
        return <div className={styles[`${text}`]}>
            <div className={styles[`dashboard-statistics-md-card`]}>
                <div className={styles["dashboard-statistics-md-card__title"]}>Total Chapters Reviewed</div>
                <div className={styles["dashboard-statistics-md-card__count"]}>
                    <h2>0</h2>
                </div>
                <div className={styles["dashboard-statistics-md-card__sub-heading"]}>Completed This Month</div>
            </div>
        </div>
    }

    return (
        <div className={styles["dashboard-statistics"]}>
            <div className={styles["dashboard-statistics__heading"]}>
                <h2>Home</h2>
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                <div className={styles["sa-col-1"]}>
                    <DashboardCounterCard title='Total Chapters Reviewed'
                        count={summary.chaptersCompletedToday}
                        subHeading='Completed Today' />
                </div>
                <div className={styles["sa-col-1"]}>
                    <DashboardCounterCard title='Total Chapters Reviewed'
                        count={summary.chaptersCompletedCurrentMonth}
                        subHeading='Completed This Month' />
                </div>
                <div className={styles["sa-col-1"]}>
                    <DashboardCounterCard title='Chapters'
                        count={summary.chaptersInProgress}
                        subHeading='In Progress' />
                </div>
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                <div className={styles["sa-col-2"]}>
                    <DashboardProgressCard title='Latest Resources Progress Overview' items={summary.latestResourcesProgress} />
                </div>
                {renderMediumCard("sa-col-2")}
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                {renderMediumCard("sa-col-2")}
                {renderMediumCard("sa-col-2")}
            </div>
        </div>);
}