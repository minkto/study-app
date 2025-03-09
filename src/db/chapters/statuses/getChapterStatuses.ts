import { queryData } from "@/db/dbHelper"
import { Status } from "@/shared.types";

export const getChapterStatuses = async() => 
{
    try {
        const queryResult = await queryData("SELECT * FROM Statuses");
        const statusesMapped = queryResult.map<Status>(x=> (
            {
                statusId: x.status_id,
                name: x.name
            }
        ));

        return statusesMapped;
    } 
    catch (error) {
        console.error("Database error:", { message: 'Database error', error: error instanceof Error ? error.message : error });
    }
}