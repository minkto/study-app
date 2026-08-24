import { deleteResource } from "@/db/resources/deleteResource";
import { getResource } from "@/db/resources/getResource";
import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ "resource-id": string }> }) => {

    const slug = (await params);
    const resourceIdNum = Number(slug["resource-id"]);
    const resource = await getResource(resourceIdNum, currentUser.userId);

    if (resource === null || resource === undefined) {
        return NextResponse.json({ message: "Could not find resource." }, { status: 404 });
    }

    return NextResponse.json(resource, { status: 200 });
});

export const DELETE = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ "resource-id": string }> }) => {

    const slug = (await params);
    const resourceIdNum = Number(slug["resource-id"]);
    const resourceFromDb = await getResource(resourceIdNum, currentUser.userId);

    if (resourceFromDb === undefined ||
        resourceFromDb === null) {
        return NextResponse.json({ message: "No resource was found." }, { status: 404 });
    }

    const result = await deleteResource(resourceIdNum);

    return NextResponse.json(result, { status: 200 });
});
