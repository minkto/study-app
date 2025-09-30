import DashboardCounterCard from '@/components/dashboard/dashboard-counter-card/DashboardCounterCard'
import styles from './page.module.css'
import { getChaptersSummary } from '@/services/dashboardStatisticsService';
import { auth } from '@clerk/nextjs/server';
import { isStringEmpty } from '@/utils/stringUtils';
import DashboardProgressCard from '@/components/dashboard/dashboard-progress-card/DashboardProgressCard';
import DashboardListCard from '@/components/dashboard/dashboard-list-card/DashboardListCard';

export default async function Page() {
    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const summary = await getChaptersSummary(userId);

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
                    <DashboardProgressCard title='Latest Resources' 
                    items={summary.latestResourcesProgress}
                    subTitle='Progress Overview'
                    postfixLabel='%' />
                </div>
                <div className={styles["sa-col-2"]}>
                    <DashboardProgressCard title='Top 4 Categories' 
                    subTitle='Current Month'
                    items={summary.chaptersCompletedCurrentMonthByCategory}
                     postfixLabel=' Chapters'
                     alternativeColors={true}  />
                </div>
            </div>
            <div className={styles["dashboard-statistics-row"]}>
                <div className={styles["sa-col-2"]}>
                    <DashboardListCard title='Chapters With Review Dates Due' 
                    subTitle='Longest Review Date'
                    items={summary.chaptersWithLongestReviewDates}
                     postfixLabel=' Days' />
                </div>
                <div className={styles["sa-col-2"]}>
                    <DashboardListCard title='Pinned Resources' 
                    subTitle='Top Pinned Resources'
                    items={summary?.pinnedResources}/>
                </div>
            </div>
        </div>);
}