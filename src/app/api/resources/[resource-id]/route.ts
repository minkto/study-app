import { deleteResource } from "@/db/resources/deleteResource";
import { getResource } from "@/db/resources/getResource";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET(_request: Request, { params }: { params: Promise<{ "resource-id": string }> }) {
    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const slug = (await params);
        const resourceIdNum = Number(slug["resource-id"]);
        const resource = await getResource(resourceIdNum, userId);

        if (resource === null || resource === undefined) {
            return NextResponse.json({ message: "Could not find resource." }, { status: 404 });
        }

        return NextResponse.json(resource, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ "resource-id": string }> }) {
    const { userId } = await auth();
    
    if (isStringEmpty(userId)) {
        return new Response("Unauthorized", { status: 401 });
    }

    const slug = (await params);
    const resourceIdNum = Number(slug["resource-id"]);
    const resourceFromDb = await getResource(resourceIdNum, userId);

    if (resourceFromDb === undefined ||
        resourceFromDb === null) {
        return NextResponse.json({ message: "No resource was found." }, { status: 404 });
    }

    const result = await deleteResource(resourceIdNum);

    return NextResponse.json(result, { status: 200 });
}