import { queryWithTranscation } from "@/db/dbHelper";

export const deleteNote = async (noteId: number) => {

    const query = [
        {
            text: `DELETE FROM notes WHERE note_id = $1`,
            values: [noteId]
        }
    ];

    const result = await queryWithTranscation(query);
    return result;
}

export default deleteNote;