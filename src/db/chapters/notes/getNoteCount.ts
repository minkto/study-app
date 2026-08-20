import { queryDataSingleRow } from "@/db/dbHelper";

export const getNoteCount = async (chapterId: number | null | undefined): Promise<number> => {

    if (!chapterId) {
        throw new Error("The Chapter ID is required to count the notes.")
    }

    try {
        const query =

            `SELECT COUNT(chapter_id)
        FROM notes
    WHERE chapter_id = $1`

        const values = [chapterId];

        const result = await queryDataSingleRow(query, values);

        if (result) {
            return Number(result.count);
        }

        return 0;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}

export default getNoteCount;