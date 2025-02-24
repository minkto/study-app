import { getData } from "@/db/getData";
import { Resource } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const resourcesDb = await getData('SELECT * FROM resources');
        const mappedResources = resourcesDb.map<Resource>((x) => (
            {
                name: x.name,
                description: x.description,
                resourceId: x.resource_id
            }));
        return NextResponse.json(mappedResources, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'Database error', error }, { status: 500 });
    }
}