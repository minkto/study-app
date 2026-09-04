import { queryWithTranscation } from "../dbHelper";

/**
 * Deletes all user data from the database for a given user ID. NOTE: This is dependent on keeping
 * database integrity in mind. If there are any foreign key constraints or dependencies, this function may fail or cause issues.
 * It is recommended to use this function with caution and ensure that it is safe to delete the user data.
 * @param userId - The ID of the user whose data is to be deleted.
 * @returns A promise that resolves to true if the deletion was successful, or false otherwise.
 * @throws An error if there is a database error during the deletion process.
 */
export const deleteUserData = async (userId: string): Promise<boolean> => {
    try {
        const queries = [
            {
                text: 'DELETE FROM resources WHERE user_id = $1',
                values: [userId]
            },
            {
                text: 'DELETE FROM categories WHERE user_id = $1',
                values: [userId]
            },
        ];

        return await queryWithTranscation(queries);
    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}
