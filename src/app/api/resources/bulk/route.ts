import { bulkCreateResourcesAndChapters } from "@/services/resourceService";
import { CreateBulkResourceDto } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const res = await request.json();

        const resources: CreateBulkResourceDto =
        {
            userId: userId,
            resources: res["resources"]
        }

        if (!resources.resources || !resources.userId) {
            return NextResponse.json({ message: "No resources have been added to the payload." },
                { status: 400 });
        }

        const result = await bulkCreateResourcesAndChapters(resources.resources,resources.userId);

        if (!result) {
            return NextResponse.json({ message: "An issue has occured with creating the resources and chapters." },
                { status: 500 });
        }

        return NextResponse.json({ success: result }, { status: 200 });

    } catch (error) {
        console.log("An issue has occured with creating the resources and chapters.", error);
        return NextResponse.json({ message: "An issue has occured with creating the resources and chapters." },
            { status: 500 });
    }
}