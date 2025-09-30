import { getChaptersWithLongestReviewDates } from "@/db/reports/getChaptersWithLongestReviewDates";
import { getLatestResourcesPercentagesReviewed } from "@/db/reports/getLatestResourcesPercentagesReviewed";
import { getPinnedResources } from "@/db/reports/getPinnedResources";
import { getTotalChaptersCompleteInMonthByCategory } from "@/db/reports/getTotalChaptersCompleteInMonthByCategory";
import { getTotalChaptersInProgress } from "@/db/reports/getTotalChaptersInProgress";
import { getTotalChaptersReviewedCurrentMonth } from "@/db/reports/getTotalChaptersReviewedCurrentMonth";
import { getTotalChaptersReviewedToday } from "@/db/reports/getTotalChaptersReviewedToday";
import { ChaptersSummary } from "@/shared.types";

export const getChaptersSummary = async (userId: string | null): Promise<ChaptersSummary> => {
    if (!userId) {
        return {
            chaptersCompletedToday: 0,
            chaptersCompletedCurrentMonth: 0,
            chaptersInProgress: 0,
            latestResourcesProgress: [],
            chaptersCompletedCurrentMonthByCategory : [],
            chaptersWithLongestReviewDates : [],
            pinnedResources : []
        }
    }

    const [today, currentMonth,inProgress,latestResourcesProgress,chaptersCompletedCurrentMonthByCategory,
        chaptersWithLongestReviewDates,pinnedResources
    ] = await Promise.all([
        getTotalChaptersReviewedToday(userId),
        getTotalChaptersReviewedCurrentMonth(userId),
        getTotalChaptersInProgress(userId),
        getLatestResourcesPercentagesReviewed(userId),
        getTotalChaptersCompleteInMonthByCategory(userId),
        getChaptersWithLongestReviewDates(userId),
        getPinnedResources(userId)
    ]);

    return {
        chaptersCompletedToday: today ?? 0,
        chaptersCompletedCurrentMonth: currentMonth ?? 0,
        chaptersCompletedCurrentMonthByCategory : chaptersCompletedCurrentMonthByCategory ?? [],
        chaptersInProgress: inProgress ?? 0,
        latestResourcesProgress : latestResourcesProgress ?? [],
        chaptersWithLongestReviewDates : chaptersWithLongestReviewDates?? [],
        pinnedResources : pinnedResources ?? []
    };
}