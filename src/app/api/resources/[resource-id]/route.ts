import { deleteResource } from "@/db/resources/deleteResource";
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

export async function DELETE(_request: Request, { params }: { params: Promise<{ "resource-id": number }> }) {
    const slug = (await params);
    const resourceFromDb = await getResource(slug["resource-id"]);

    if (resourceFromDb === undefined ||
        resourceFromDb === null) {
        return NextResponse.json({ message: "No resource was found." }, { status: 404 });
    }

    const result = await deleteResource(slug["resource-id"]);

    return NextResponse.json(result, { status: 200 });
}