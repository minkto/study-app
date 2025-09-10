import { getTotalChaptersReviewedCurrentMonth } from "@/db/reports/getTotalChaptersReviewedCurrentMonth";
import { getTotalChaptersReviewedToday } from "@/db/reports/getTotalChaptersReviewedToday";
import { ChaptersSummary } from "@/shared.types";

export const getChaptersSummary = async (userId: string | null): Promise<ChaptersSummary> => {
    if (!userId) {
        return {
            chaptersCompletedToday: 0,
            chaptersCompletedCurrentMonth: 0
        }
    }

    const [today, currentMonth] = await Promise.all([
        getTotalChaptersReviewedToday(userId),
        getTotalChaptersReviewedCurrentMonth(userId),
    ]);

    return {
        chaptersCompletedToday: today ?? 0,
        chaptersCompletedCurrentMonth: currentMonth ?? 0,
    };
}