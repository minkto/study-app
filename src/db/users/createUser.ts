import { User } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export async function createUserFromClerk(clerkUserId: string): Promise<User | undefined| null> {
    try {
        let user: User | null = null;
        const query =
        {
            text: "INSERT INTO users(clerk_user_id)VALUES($1) RETURNING *;",
            values: [clerkUserId]
        };

        const userResult = await queryDataSingleRow(query.text, query.values);
        if (userResult) {
            user =
            {
                userId: userResult.user_id,
                clerkUserId: userResult.clerk_user_id
            }
        }

        return user;
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}