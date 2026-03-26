import { bulkCreateResourcesWithChapters } from "@/db/resources/createResource";
import { getResource } from "@/db/resources/getResource"
import getChaptersProgressDetails from "@/db/resources/getResourceChaptersProgress";
import { calculatePageCount, getResources } from "@/db/resources/getResources";
import { GetResourceDto, GetResourcesDto, ListingSearchQuery, Resource } from "@/shared.types";

export const getResourceDto = async (resourceId: number, userId: string | null): Promise<GetResourceDto | null> => {

    const resource = await getResource(resourceId, userId);

    if (resource !== null && resource !== undefined) {
        const chaptersProgress = await getChaptersProgressDetails(resourceId);

        const dto: GetResourceDto =
        {
            name: resource.name,
            resourceId: resource.resourceId,
            categoryId: resource.categoryId,
            categoryName: resource.categoryName,
            description: resource.description,
            chaptersProgressDetails: chaptersProgress
        }

        return dto;
    }

    return null;
}

export const getResourcesDto = async (queryParams: ListingSearchQuery): Promise<GetResourcesDto | null> => {

    const mappedResources = await getResources(queryParams);

    if (Array.isArray(mappedResources)) {
        const mappedDto: GetResourceDto[] = await Promise.all(
            mappedResources.map(async (x) => {
                const chaptersProgress = await getChaptersProgressDetails(x?.resourceId ?? 0);
                return {
                    name: x.name,
                    description: x.description,
                    resourceId: x.resourceId,
                    categoryName: x.categoryName,
                    chaptersProgressDetails: chaptersProgress
                };
            })
        );

        return {
            resources: mappedDto,
            pageCount: await calculatePageCount(queryParams)
        };
    }
    return null;
}

export const bulkCreateResourcesAndChapters = async (resources: Resource[], userId: string): Promise<boolean> => {

    const result = await bulkCreateResourcesWithChapters(resources, userId);
    if (!result) {
        console.log("Could not create resources, with chapters.", resources, userId);
    }

    return result;
}