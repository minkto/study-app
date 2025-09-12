import { queryData } from "../dbHelper";

export const getTotalChaptersCompleteInMonthByCategory = async (userId: string) => 
{
    try {
           const query =
               `SELECT
                COALESCE(cat.name, 'None') AS category_name,
                COUNT(CASE 
                    WHEN c.last_date_completed IS NOT NULL 
                    AND 
                        date_trunc('month', c.last_date_completed::date) = date_trunc('month', CURRENT_DATE AT TIME ZONE 'UTC')
                            THEN 1 
                            ELSE NULL 
                    END) chapters_completed_current_month
            FROM Chapters c
            INNER JOIN resources r ON r.resource_id = c.resource_id
            LEFT JOIN categories cat ON cat.category_id = r.category_id 
            WHERE r.user_id = $1
            GROUP by cat.name
            ORDER BY chapters_completed_current_month desc
            LIMIT 4`
   
           const result = await queryData(query, [userId]);
   
           const categoriesResult = result.map(r => {
               return {
                   name: r.category_name,
                   numberValue: r.chapters_completed_current_month
               }
           });
   
           return categoriesResult
       }
       catch (error) {
           console.log("An error has occured in the database: ", error);
       } 
}