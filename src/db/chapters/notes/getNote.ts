import { queryDataSingleRow } from "@/db/dbHelper";

export const getNote = async (noteId: number, chapterId: number, userId: string | null) => {

    if (!userId) {
        throw new Error("User Id must be defined.");
    }
    
    const query =
        `SELECT 
            n.note_id,
            n.chapter_id,
            n.content  
        FROM notes n
            INNER JOIN chapters c ON n.chapter_id = c.chapter_id
            INNER JOIN resources r ON c.resource_id = r.resource_id
        WHERE n.note_id = $1 
            AND c.chapter_id = $2 
            AND r.user_id = $3`

    const values = [noteId, chapterId, userId];

    const result = await queryDataSingleRow(query, values);

    if (result) {
        return {
            chapterId: result["chapter_id"],
            noteId: result["note_id"],
            content: result["content"],
        };
    }

    return null;
}