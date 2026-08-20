import { queryWithTranscation } from "@/db/dbHelper";

export const deleteNote = async (noteId: number) => {

    try {
        const query = [
            {
                text: `DELETE FROM notes WHERE note_id = $1`,
                values: [noteId]
            }
        ];

        const result = await queryWithTranscation(query);
        return result;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}

export default deleteNote;