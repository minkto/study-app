import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { createUserFromClerk } from "@/db/users/createUser";
import { createUserSettings } from "@/db/users/settings/createUserSettings";

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
                return handleUserCreation(webhookEvent?.data?.id);
            default:
                return NextResponse.json({ message: 'Event type not handled' }, { status: 400 });
        }

    } catch (err) {
        return NextResponse.json({ message: 'Bad Request', error: err instanceof Error ? err.message : err }, { status: 404 });
    }
}

async function handleUserCreation(clerkUserId: string) {
    const newUser = await createUserFromClerk(clerkUserId);
    if(!newUser)
    {
        console.error("Failed to create User from Clerk with Clerk id: ", clerkUserId);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }

    const userSettingsResult = await createUserSettings({ userId: newUser?.userId });
    if (userSettingsResult && userSettingsResult > 0) {
        console.log("Clerk User created in DB with clerk id: ", clerkUserId);
        return NextResponse.json({ success: true }, { status: 200 })
    } else {
        console.error("Failed to create User Settings with User id: ", clerkUserId);
        return NextResponse.json({ message: 'Failed to create user' }, { status: 500 });
    }
}