import { queryData } from "../dbHelper";

export const getChaptersWithLongestReviewDates = async (userId: string) => {
    try {
        const query =
            `SELECT  
                    r.name AS resource_name,
                    c.name  AS chapter_name,
                    COALESCE(CAST((CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date - (last_date_completed AT TIME ZONE 'UTC')::date  AS integer), 0) AS days_since_last_completed   
                FROM chapters  c 
                INNER JOIN resources r ON c.resource_id = r.resource_id
                WHERE r.user_id = $1
                ORDER BY days_since_last_completed DESC
                LIMIT 4;`

        const result = await queryData(query, [userId]);

        const dataResult = result.map(r => {
            return {
                title: r.resource_name,
                subTitle: r.chapter_name,
                value: r.days_since_last_completed
            }
        });

        return dataResult;
    }
    catch (error) {
        console.log("An error has occured in the database: ", error);
    }

}