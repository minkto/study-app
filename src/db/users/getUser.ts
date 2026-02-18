import { AppUser } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper"

export const getUserByClerkUserId = async (clerkUserId: string | null): Promise<AppUser | null> => {

    const query = `SELECT 
                        u.user_id,
                        u.clerk_user_id
                    FROM users u 
                    WHERE u.clerk_user_id = $1
                    LIMIT 1`

    const result = await queryDataSingleRow(query, [clerkUserId]);

    if (result !== null && result !== undefined) {
        return {
            userId: Number(result['user_id']),
            clerkUserId: result['clerk_user_id'],
        }
    }

    return null;
}