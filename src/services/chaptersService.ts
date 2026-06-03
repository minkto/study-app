import { getChapter } from "@/db/chapters/getChapter"
import { Chapter } from "@/shared.types";

export const getChapterDetails = async(chapterId: number, userId: string): Promise<Chapter | null> => 
{
    const chapter = await getChapter(chapterId,userId);
    return chapter;
}