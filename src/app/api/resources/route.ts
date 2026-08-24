import { FilterByQueryKeys } from "@/constants/constants";
import { createResource } from "@/db/resources/createResource";
import { getResource } from "@/db/resources/getResource";
import { updateResource } from "@/db/resources/updateResource";
import { getResourcesDto } from "@/services/resourceService";
import { AppUser, ListingSearchQuery, Resource } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextRequest, NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser, request: NextRequest) => {

    const searchParams = request.nextUrl.searchParams;
    const listingSearchQuery: ListingSearchQuery =
    {
        searchTerm: searchParams?.get('search-term')?.trim(),
        sortBy: searchParams?.get('sortBy')?.trim(),
        sortOrder: searchParams?.get('sortOrder')?.trim(),
        page: searchParams?.get('page')?.trim(),
        filters:
        {
            category: searchParams?.getAll(FilterByQueryKeys.ResourceListings.CATEGORY),
        },
        userId: currentUser.userId
    };

    const mappedResources = await getResourcesDto(listingSearchQuery);

    if (mappedResources === null || mappedResources === undefined) {
        return NextResponse.json({ message: "No resources found." }, { status: 404 });
    }
    else {
        return NextResponse.json(mappedResources, { status: 200 });
    }
});

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const res = await request.json();

    const newResource = await createResource(
        {
            name: res["name"],
            description: res["description"],
            categoryId: res["categoryId"],
            isPinned: res["isPinned"],
            userId: currentUser.userId,
        });

    return NextResponse.json(newResource, { status: 200 });
});

export const PUT = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const res = await request.json();

    const resourceFromDb = await getResource(res["resourceId"], currentUser.userId);

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
        isPinned: res["isPinned"],
        userId: currentUser.userId
    };

    const resource = await updateResource(res["resourceId"], resourceFields);

    return NextResponse.json(resource, { status: 200 });
});
