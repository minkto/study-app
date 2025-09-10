import { getTotalChaptersReviewedReport } from "@/db/reports/getTotalChaptersReviewedReport";
import { ChaptersSummary } from "@/shared.types";

export const  getChaptersSummary = async(userId: string| null) : Promise<ChaptersSummary> => 
{    
    return userId ? getTotalChaptersReviewedReport(userId) ?? 0 : 
    {
        chaptersCompletedToday : 0
    };
}