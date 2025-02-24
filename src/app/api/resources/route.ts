import { getData,insertData } from "@/db/dbHelper";
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


export async function POST(request: Request) {
    try {
        const res = await request.json();
        const insertResult = await insertData(
        {
            text: "INSERT INTO resources(name,description,category_id)VALUES($1,$2,$3)",
            values:[
                res["name"],
                res["description"],
                res["categoryId"]
            ] 
        });

        return NextResponse.json(insertResult, { status: 200 });

    } catch (error) {
        console.error("Database error:", error);
        return NextResponse.json({ message: 'Database error', error: error instanceof Error ? error.message : error }, 
            { status: 500 });
    }
}