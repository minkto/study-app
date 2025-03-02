import { queryDataRowCount } from "../dbHelper";

export async function deleteChapter(chapterId : number)
{
    try
    {
        const query = 
        {
            text: 'DELETE FROM chapters WHERE chapter_id = $1',
            values: [chapterId]
        }

        const result = queryDataRowCount(query);
        return result;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}