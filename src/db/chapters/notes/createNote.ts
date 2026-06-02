import { queryDataSingleRow } from "@/db/dbHelper";
import { Note } from "@/shared.types";

export const createNote = async(note: Note) => {
    try {

        const query = "INSERT INTO notes(chapter_id, content) VALUES($1, $2) RETURNING note_id";
        const values = [note.chapterId, note.content];

        const result = await queryDataSingleRow(query, values);
        return {
            noteId: result.note_id
        };

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        return null;
    }
}

export default createNote;