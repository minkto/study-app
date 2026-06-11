import { getChapter } from "@/db/chapters/getChapter"
import getNotes from "@/db/chapters/notes/getNotes";
import { Chapter } from "@/shared.types";

export const getChapterDetails = async (chapterId: number, userId: string): Promise<Chapter | null> => {
    const chapter = await getChapter(chapterId, userId);
    if (chapter) {
        chapter.notes = await getNotes(chapterId, userId);
    }

    return chapter;
}