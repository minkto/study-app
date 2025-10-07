import { NextResponse } from "next/server";
import { Webhook } from "svix"

const webhookSecret: string = process.env.CLERK_SYNC_WEBHOOK_SECRET || "your-secret"

export async function POST(request: Request) {

    const svix_id = request.headers.get("svix-id") ?? "";
    const svix_timestamp = request.headers.get("svix-timestamp") ?? "";
    const svix_signature = request.headers.get("svix-signature") ?? "";

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