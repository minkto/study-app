import { createResource } from "@/db/resources/createResource";
import { getResource } from "@/db/resources/getResource";
import { updateResource } from "@/db/resources/updateResource";
import { getResourcesDto } from "@/services/resourceService";
import { Resource } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const mappedResources = await getResourcesDto();
        if (mappedResources === null || mappedResources === undefined) {
            return NextResponse.json({ message: "No resources found." }, { status: 404 });
        }
        else {
            return NextResponse.json(mappedResources, { status: 200 });
        }
    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const res = await request.json();
        const newResource = await createResource(
            {
                name: res["name"],
                description: res["description"],
                categoryId: res["categoryId"]
            });

        return NextResponse.json(newResource, { status: 200 });

    } catch (error) {
        console.error("API error:", error);
        return NextResponse.json({ message: 'API Error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}

export async function PUT(request: Request) {
    try {
        const res = await request.json();
        const resourceFromDb = await getResource(res["resourceId"]);

        if (resourceFromDb === undefined ||
            resourceFromDb === null) {
            return NextResponse.json({ message: "No resource was found." }, { status: 404 });
        }

        const resourceFields: Resource =
        {
            resourceId: res["resourceId"],
            name: res["name"],
            description: res["description"],
            categoryId: res["categoryId"],
        };

        const resource = await updateResource(res["resourceId"], resourceFields);

        return NextResponse.json(resource, { status: 200 });

    } catch (error) {
        console.error("API Error:", error);
        return NextResponse.json({ message: 'API Error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}