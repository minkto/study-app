import { queryDataSingleRow } from "../dbHelper";

export default async function resourceWithUserExists(resourceId: number, userId: string | null): Promise<Boolean> {

    try {
        const query = "SELECT r.name FROM resources r WHERE r.resource_id = $1 AND r.user_id = $2 LIMIT 1";
        const result = await queryDataSingleRow(query, [resourceId, userId]);
        
        if(result)
        {
            return true;
        }

        return false;
    }
    catch (error) {
        console.log("Database error: ", error);
        return false;
    }
}