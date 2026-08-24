import { bulkCreateResourcesAndChapters } from "@/services/resourceService";
import { AppUser, CreateBulkResourceDto } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const res = await request.json();

    const resources: CreateBulkResourceDto =
    {
        userId: currentUser.userId,
        resources: res["resources"]
    }

    if (!resources.resources || !resources.userId) {
        return NextResponse.json({ message: "No resources have been added to the payload." },
            { status: 400 });
    }

    const result = await bulkCreateResourcesAndChapters(resources.resources, resources.userId);

    if (!result) {
        return NextResponse.json({ message: "An issue has occured with creating the resources and chapters." },
            { status: 500 });
    }

    return NextResponse.json({ success: result }, { status: 200 });
});
