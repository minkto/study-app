import { createResource } from "@/db/resources/createResource";
import { getResource } from "@/db/resources/getResource";
import { getResoures } from "@/db/resources/getResources";
import { updateResource } from "@/db/resources/updateResource";
import { Resource } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const mappedResources = await getResoures();
        return NextResponse.json(mappedResources, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Database error', error }, { status: 500 });
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
        console.error("Database error:", error);
        return NextResponse.json({ message: 'Database error', error: error instanceof Error ? error.message : error },
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
        console.error("Database error:", error);
        return NextResponse.json({ message: 'Database error', error: error instanceof Error ? error.message : error },
            { status: 500 });
    }
}