import { NextRequest, NextResponse } from "next/server";
import { verifyWebhook } from "@clerk/nextjs/webhooks";

export async function POST(request: NextRequest) {

    // Get the webhook secret - fail fast if not configured
    const webhookSecret = process.env.CLERK_WEBHOOK_SIGNING_SECRET;

    if (!webhookSecret) {
        console.error("CLERK_SYNC_WEBHOOK_SECRET is not configured");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    try {
        const webhookEvent = await verifyWebhook(request, { signingSecret: webhookSecret });
        if (webhookEvent.type === 'user.created') {
            //TODO: Sync up the users.
            console.log("Webhook event: ", webhookEvent);
            console.log("Syncing - user id: ", webhookEvent?.data?.id);
            console.log("Http Request: ", request);

            return NextResponse.json({ success: true }, { status: 200 })
        }

    } catch (err) {
        return NextResponse.json({ message: 'Bad Request', error: err instanceof Error ? err.message : err })
    }

    return NextResponse.json({ message: 'Bad Request' }, { status: 400 })
}