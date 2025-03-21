import { Resource } from "@/shared.types";
import { queryData } from "../dbHelper";

export async function getResoures() {

    try {
        const resourcesDb = await queryData(
        `SELECT 
            r.*,
            c.name AS category_name  
        FROM resources r
        LEFT JOIN categories c ON r.category_id = c.category_id`);
        
        const mappedResources = resourcesDb.map<Resource>((x) => (
            {
                name: x.name,
                description: x.description,
                resourceId: x.resource_id,
                categoryName : x.category_name
            }));
        return mappedResources;
    }
    catch (error) {
        return { message: 'Database error', error };
    }
}