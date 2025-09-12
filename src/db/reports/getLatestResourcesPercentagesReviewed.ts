import { queryData } from "../dbHelper";

export const getLatestResourcesPercentagesReviewed = async (userId: string) => {
    try {
        const query =
            `SELECT  
	  	        r.name,
		        (CASE WHEN COUNT(*) = 0 
                    THEN 100 
		        ELSE ROUND((COUNT(CASE WHEN c.status_id = 2 THEN 1 ELSE NULL END) /  CAST(COUNT(*) AS NUMERIC))  * 100.0) END )  AS chapters_percentage_completed
	        FROM Chapters c
	        INNER JOIN resources r ON c.resource_id = r.resource_id
	        WHERE r.user_id = $1
	        GROUP BY r.resource_id
	        ORDER BY r.resource_id DESC
	        LIMIT 4`

        const result = await queryData(query, [userId]);

        const resources = result.map(r => {
            return {
                name: r.name,
                numberValue: r.chapters_percentage_completed
            }
        });

        return resources
    }
    catch (error) {
        console.log("An error has occured in the database: ", error);
    }
}