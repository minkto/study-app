import { getChaptersReviewedAndInProgress } from "@/db/reports/getChaptersReviewedAndInProgress";
import { getChaptersWithLongestReviewDates } from "@/db/reports/getChaptersWithLongestReviewDates";
import { getLatestResourcesPercentagesReviewed } from "@/db/reports/getLatestResourcesPercentagesReviewed";
import { getPinnedResources } from "@/db/reports/getPinnedResources";
import { getTotalChaptersCompleteInMonthByCategory } from "@/db/reports/getTotalChaptersCompleteInMonthByCategory";
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

    const chaptersReviewedAndInProgress = await getChaptersReviewedAndInProgress(userId);
    const latestResourcesPercentagesReviewed = await getLatestResourcesPercentagesReviewed(userId);
    const totalChaptersCompleteInMonthByCategory = await getTotalChaptersCompleteInMonthByCategory(userId);
    const chaptersWithLongestReviewDates = await getChaptersWithLongestReviewDates(userId);
    const pinnedResources = await getPinnedResources(userId);

    return {
        chaptersCompletedToday: chaptersReviewedAndInProgress.chaptersCompletedToday ?? 0,
        chaptersCompletedCurrentMonth: chaptersReviewedAndInProgress.chaptersCompletedCurrentMonth ?? 0,
        chaptersInProgress: chaptersReviewedAndInProgress.chaptersInProgress ?? 0,
        chaptersCompletedCurrentMonthByCategory : totalChaptersCompleteInMonthByCategory ?? [],
        latestResourcesProgress : latestResourcesPercentagesReviewed ?? [],
        chaptersWithLongestReviewDates : chaptersWithLongestReviewDates?? [],
        pinnedResources : pinnedResources ?? []
    };
}