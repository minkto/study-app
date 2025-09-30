import { queryData } from "../dbHelper";

export const getPinnedResources = async (userId: string) => 
{
    try {
           const query =
               `SELECT 
                    r.name 
                FROM Resources r
                WHERE is_pinned = true AND user_id = $1
                ORDER BY is_pinned asc
                LIMIT 5;`
   
           const result = await queryData(query, [userId]);
   
           const pinnedResources = result.map(r => {
               return {
                   title: r.name,
               }
           });
   
           return pinnedResources;
       }
       catch (error) {
           console.log("An error has occured in the database: ", error);
       } 
}