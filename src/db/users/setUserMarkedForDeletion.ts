import { AppUser } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function setUserMarkedForDeletion(userId: string) {
    try {
        const result = await queryData(`UPDATE users
                    SET 
                        deletion_requested_at = $2,
                    WHERE
                        user_id = $1
                        RETURNING *`, [userId, new Date()]);

        if (result.length > 0) {
            const row = result[0];

            const updatedAppUser: AppUser = {
                userId: row.user_id,
                clerkUserId: row.clerk_user_id,
                deletionRequestedAt: row.deletion_requested_at ? new Date(row.deletion_requested_at) : null,
            };

            return updatedAppUser;
        }

        return null;

    } catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
        throw error;
    }
}