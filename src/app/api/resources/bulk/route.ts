import { getCurrentAppUser } from "@/services/auth/userService";
import { bulkCreateResourcesAndChapters } from "@/services/resourceService";
import { CreateBulkResourceDto } from "@/shared.types";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

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