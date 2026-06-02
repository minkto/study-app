import { queryDataSingleRow } from "@/db/dbHelper";
import { Note } from "@/shared.types";

export const updateNote = async (note: Note): Promise<Note | null> => {
    const query = `UPDATE notes 
                   SET content = $1
                   WHERE note_id = $2
                   RETURNING *`;

    const values = [note.content, note.noteId]

    const result = await queryDataSingleRow(query, values);

    if (result) {
        return {
            noteId: note.noteId,
            chapterId: note.chapterId,
            content: note.content
        }
    }

    return null;
}


export default updateNote;