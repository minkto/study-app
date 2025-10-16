import { queryDataRowCount } from "../dbHelper";

export async function createUserFromClerk(clerkUserId: string) {

    try {
        const query =
        {
            text: "INSERT INTO users(clerk_user_id)VALUES($1)",
            values: [clerkUserId]
        };

        const resultRowCount = await queryDataRowCount(query);
        return resultRowCount;
    }
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}