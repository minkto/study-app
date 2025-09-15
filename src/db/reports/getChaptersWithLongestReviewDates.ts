import { queryData } from "../dbHelper";

export const getChaptersWithLongestReviewDates = async (userId: string) => {
    
    const daysBeforeReviewDue = process.env.DEFAULT_DAYS_BEFORE_CHAPTER_REVIEW_DUE ?? 30
    
    try {
        const query =
            `WITH params AS (
                SELECT (CURRENT_DATE AT TIME ZONE 'UTC')::date AS today
            ),
            resource_stats AS (
                SELECT  
                    r.name AS resource_name,
                    c.name AS chapter_name,
                (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date  - (last_date_completed AT TIME ZONE 'UTC')::date   AS days_since_last_completed
                FROM chapters c 
                INNER JOIN resources r ON c.resource_id = r.resource_id
                CROSS JOIN params p
                WHERE r.user_id = $1
                AND (CURRENT_TIMESTAMP AT TIME ZONE 'UTC')::date  - (last_date_completed AT TIME ZONE 'UTC')::date > $2
            )
            SELECT 
                resource_name, 
                chapter_name, 
                days_since_last_completed
            FROM resource_stats
            ORDER BY days_since_last_completed DESC
            LIMIT 4;`

        const result = await queryData(query, [userId, daysBeforeReviewDue]);

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