import { getResource } from "@/db/resources/getResource";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "resource-id": number }> }) {
    try {
        const slug = (await params);
        const resource = await getResource(slug["resource-id"]);

        if(resource === null || resource === undefined)
        {
            return NextResponse.json({message: "Could not find resource."}, { status: 404 });
        }

        return NextResponse.json(resource, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}