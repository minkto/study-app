import { getLatestResourcesPercentagesReviewed } from "@/db/reports/getLatestResourcesPercentagesReviewed";
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
            latestResourcesProgress: []
        }
    }

    const [today, currentMonth,inProgress,latestResourcesProgress] = await Promise.all([
        getTotalChaptersReviewedToday(userId),
        getTotalChaptersReviewedCurrentMonth(userId),
        getTotalChaptersInProgress(userId),
        getLatestResourcesPercentagesReviewed(userId)
    ]);

    return {
        chaptersCompletedToday: today ?? 0,
        chaptersCompletedCurrentMonth: currentMonth ?? 0,
        chaptersInProgress: inProgress ?? 0,
        latestResourcesProgress : latestResourcesProgress ?? []
    };
}