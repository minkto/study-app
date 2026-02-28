import { Category } from "@/shared.types";
import { queryDataSingleRow } from "../dbHelper";

export default async function categoryWithUserExists(category: Category): Promise<boolean> {
    try {
        let query = `SELECT COUNT(c.name)  
        FROM categories c 
        WHERE LOWER(c.name) = LOWER($1) 
        AND c.user_id = $2`;

        const values = [category.name, category.userId];

        if (category.categoryId) {
            query += " AND c.category_id != $3";
            values.push(category.categoryId);
        }

        const result = await queryDataSingleRow(query, values);

        if (result && Number(result['count']) > 0) {
            return true;
        }

        return false;
    }
    catch (error) {
        console.log("Database error: ", error);
        return false;
    }
}