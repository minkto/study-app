import { queryDataRowCount } from "@/db/dbHelper";

export const deleteNote = async (noteId: number, chapterId: number, userId: string | null) => {

    try {
        const query = {
            text: `DELETE FROM notes n
                USING chapters c, resources r
                WHERE n.note_id = $1
                    AND n.chapter_id = $2
                    AND n.chapter_id = c.chapter_id
                    AND c.resource_id = r.resource_id
                    AND r.user_id = $3`,
            values: [noteId, chapterId, userId]
        };

        const rowCount = await queryDataRowCount(query);
        return (rowCount ?? 0) > 0;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}

export default deleteNote;
