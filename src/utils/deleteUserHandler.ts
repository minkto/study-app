import { NextResponse } from "next/server";
import { deleteUser } from "@/db/users/deleteUser";
import { clerkClient } from "@clerk/nextjs/server";
import { setUserMarkedForDeletion } from "@/db/users/setUserMarkedForDeletion";
import { AppUser } from "@/shared.types";

export const deleteUserHandler = async (currentUser: AppUser): Promise<NextResponse | Response> => {

    try {
        // 1. Step 1 of 3 Deletion set flag in the database for the user to be deleted.
        await markUserForDeletion(currentUser.userId);

        // 2. Step 2 of 3 delete account from Clerk. This will trigger the webhook again for user.deleted event.
        await deleteUserFromClerk(currentUser.userId, currentUser.clerkUserId);

        // 3. Step 3 of 3 Deletion set flag in the database for the user to be deleted.
        await deleteUserFromDatabase(currentUser.userId);

    } catch (error) {
        console.error("Error deleting user from webhook with Clerk ID:", currentUser.clerkUserId, error);
        return NextResponse.json({ message: 'Failed to delete user', error: error instanceof Error ? error.message : error }, { status: 500 });
    }

    return new Response(null, { status: 204 });
}

async function markUserForDeletion(userId: string) {
    try {
        const markUserForDeletionResult = await setUserMarkedForDeletion(userId);
        if (!markUserForDeletionResult) {
            console.error("DELETE User Step 1 of 3 - Failed to mark user for deletion in the database with User ID:", userId);
            return NextResponse.json({ message: 'Failed to mark user for deletion in database' }, { status: 500 });
        }
    } catch (error) {
        console.error("DELETE User Step 1 of 3 - Failed to mark user for deletion in the database with User ID:", userId);
        throw error;
    }
}

async function deleteUserFromClerk(userId: string, clerkUserId: string) {
    try {
        const client = await clerkClient();
        await client.users.deleteUser(clerkUserId);
    } catch (error) {
        console.error("DELETE User Step 2 of 3 - Failed to delete user from the clerk with User ID:", userId);
        throw error;
    }
}

async function deleteUserFromDatabase(userId: string) {
    try {
        const userDeleted = await deleteUser(userId);
        if (!userDeleted) {
            console.error("DELETE User Step 3 of 3 - Failed final step to delete user from the database with User ID:", userId);
            return NextResponse.json({ message: 'Failed to delete user from database' }, { status: 500 });
        }

    } catch (error) {
        console.error("DELETE User Step 3 of 3 - Failed final step to delete user from the database with User ID:", userId);
        throw error;
    }
}