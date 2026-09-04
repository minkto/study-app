import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createUserFromClerk } from "@/db/users/createUser";
import { createUserSettings } from "@/db/users/settings/createUserSettings";
import { deleteUserHandler } from "@/utils/deleteUserHandler";
import { getUserByClerkUserId } from "@/db/users/getUser";

export async function POST(request: NextRequest) {

    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!webhookSecret) {
        console.error("CLERK_WEBHOOK_SIGNING_SECRET is not configured");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    try {
        const webhookEvent = await verifyWebhook(request, { signingSecret: webhookSecret });
        switch (webhookEvent.type) {
            case 'user.created':
                return await handleUserCreation(webhookEvent?.data?.id);
            case 'user.deleted':
                return await handleUserDeletion(webhookEvent?.data?.id);
            default:
                return NextResponse.json({ message: 'Event type not handled' }, { status: 400 });
        }

    } catch (err) {
        return NextResponse.json({ message: 'Bad Request', error: err instanceof Error ? err.message : err }, { status: 404 });
    }
}

async function handleUserDeletion(clerkUserId: string | undefined) {

    try {
        const currentUser = await getUserByClerkUserId(clerkUserId);
        if (!currentUser) {
            console.error("Could not find user in the database with Clerk ID:", clerkUserId);
            return new NextResponse(null, { status: 204 });
        }

        return await deleteUserHandler(currentUser);
    } catch (error) {
        console.error("Error deleting user from webhook with Clerk ID:", clerkUserId, error);
        return NextResponse.json({ message: 'Failed to delete user', error: error instanceof Error ? error.message : error }, { status: 500 });
    }
}

async function handleUserCreation(clerkUserId: string | undefined) {
    if (!clerkUserId) {
        console.error("Clerk User ID is undefined");
        return NextResponse.json({ message: 'Clerk User ID is undefined' }, { status: 400 });
    }
    const newUser = await createUserFromClerk(clerkUserId);
    if (!newUser) {
        console.error("Failed to create User from Clerk with Clerk id: ", clerkUserId);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    const userSettingsResult = await createUserSettings({ userId: newUser?.userId });
    if (userSettingsResult && userSettingsResult.userSettingId > 0) {
        console.log("Clerk User created in DB with clerk id: ", clerkUserId);
        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        console.error("Failed to create User Settings with User id: ", clerkUserId);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}