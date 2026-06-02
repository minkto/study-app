import { queryData } from "@/db/dbHelper";
import { Note } from "@/shared.types";

export const getNotes = async (chatperId: number, userId: string | null) => {

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
        WHERE c.chapter_id = $1
            AND r.user_id = $2`

    const values = [chatperId, userId];

    const result = await queryData(query, values);
    if (result?.length > 0) {
        const notes = result.map<Note>((x) => (
            {
                noteId: x.note_id,
                chapterId: x.chapter_id,
                content: x.content
            }
        ));

        return notes;
    }
}

export default getNotes;