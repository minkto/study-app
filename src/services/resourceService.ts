import { createResourceWithChapters } from "@/db/resources/createResource";
import { getResource } from "@/db/resources/getResource"
import getResourcePercentageComplete from "@/db/resources/getResourcePercentageComplete";
import { calculatePageCount, getResources } from "@/db/resources/getResources";
import { Chapter, GetResourceDto, GetResourcesDto, ListingSearchQuery, Resource } from "@/shared.types";

export const getResourceDto = async (resourceId: number, userId: string | null): Promise<GetResourceDto | null> => {
    const resource = await getResource(resourceId, userId);

    if (resource !== null && resource !== undefined) {
        const percentageCompleted = await getResourcePercentageComplete(resourceId);

        const dto: GetResourceDto =
        {
            name: resource.name,
            resourceId: resource.resourceId,
            categoryId: resource.categoryId,
            categoryName: resource.categoryName,
            description: resource.description,
            percentageCompleted: percentageCompleted
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
                const percentageCompleted = await getResourcePercentageComplete(x?.resourceId ?? 0);
                return {
                    name: x.name,
                    description: x.description,
                    resourceId: x.resourceId,
                    categoryName: x.categoryName,
                    percentageCompleted: percentageCompleted
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

export const createResourcesAndChapters = async (resource: Resource,chapters : Chapter[]) :  Promise<boolean> => {

    const result = await createResourceWithChapters(resource,chapters);
    if(!result)
    {
        console.log("Could not create resources, with chapters."); 
    }

    return result;
}