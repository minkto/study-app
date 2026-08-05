import { AppUser } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export async function createUserFromClerk(clerkUserId: string): Promise<AppUser | undefined | null> {
    try {
        const query = {
            text: `
            INSERT INTO users (clerk_user_id)
            VALUES ($1)
            ON CONFLICT (clerk_user_id)
            DO UPDATE SET clerk_user_id = EXCLUDED.clerk_user_id
            RETURNING user_id, clerk_user_id
        `,
            values: [clerkUserId],
        };

        const userResult = await queryDataSingleRow(
            query.text,
            query.values
        );

        if (!userResult) {
            throw new Error(
                `Failed to ensure user for Clerk user ${clerkUserId}`
            );
        }

        return {
            userId: userResult.user_id,
            clerkUserId: userResult.clerk_user_id,
        };
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}