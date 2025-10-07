import { NextResponse } from "next/server";
import { Webhook } from "svix"

export async function POST(request: Request) {

    // Get the webhook secret - fail fast if not configured
    const webhookSecret = process.env.CLERK_SYNC_WEBHOOK_SECRET;
    
    if (!webhookSecret) {
        console.error("CLERK_SYNC_WEBHOOK_SECRET is not configured");
        return NextResponse.json(
            { error: "Webhook secret not configured" },
            { status: 500 }
        );
    }

    // Validate the secret format
    if (!webhookSecret.startsWith("whsec_")) {
        console.error("Invalid webhook secret format. Must start with 'whsec_'");
        return NextResponse.json(
            { error: "Invalid webhook secret format" },
            { status: 500 }
        );
    }

    // Get Svix headers
    const svix_id = request.headers.get("svix-id") ?? "";
    const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
    const svix_signature = request.headers.get("svix-signature") ?? "";

    // Check if headers are present
    if (!svix_id || !svix_timestamp || !svix_signature) {
        return NextResponse.json(
            { error: "Missing svix headers" },
            { status: 400 }
        );
    }
    const body = await request.text();

    const svix = new Webhook(webhookSecret);

    let msg;

    try {
        msg = svix.verify(body, {
            "svix-id": svix_id,
            "svix-timestamp": svix_timestamp,
            "svix-signature": svix_signature
        });

    } catch (err) {
        return NextResponse.json({ message: 'Bad Request', error: err instanceof Error ? err.message : err })
    }

    console.log(msg);
    console.log("Will sync user....");
    //TODO: Sync up the users.


    console.log("Users Request: ", request)
}