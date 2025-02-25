import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResoures() {

    try {
        const resourcesDb = await queryData('SELECT * FROM resources');
        const mappedResources = resourcesDb.map<Resource>((x) => (
            {
                name: x.name,
                description: x.description,
                resourceId: x.resource_id
            }));
        return mappedResources;
    }
    catch (error) {
        return { message: 'Database error', error };
    }
}