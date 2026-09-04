import { queryDataRowCount } from "../dbHelper";

export const deleteUser = async (userId: string): Promise<boolean> => {

    try {
        const query =
        {
            text: 'DELETE FROM users WHERE user_id = $1',
            values: [userId]
        }

        const rowCount = await queryDataRowCount(query);
        return (rowCount ?? 0) > 0;
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}