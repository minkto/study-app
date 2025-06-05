import { getResource } from "@/db/resources/getResource"
import getResourcePercentageComplete from "@/db/resources/getResourcePercentageComplete";
import { getResources } from "@/db/resources/getResources";
import { GetResourceDto, ListingSearchQuery } from "@/shared.types";

export const getResourceDto = async (resourceId: number): Promise<GetResourceDto | null> => {
    const resource = await getResource(resourceId);

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

export const getResourcesDto = async (queryParams: ListingSearchQuery): Promise<GetResourceDto[] | null> => {

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

        return mappedDto;
    }
    return null;
}