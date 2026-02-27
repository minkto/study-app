import { createCategory } from "@/db/categories/createCategory";
import { getUserCategories } from "@/db/categories/getUserCategories";
import { getCurrentAppUser } from "@/services/auth/userService";
import validateCategoriesService from "@/services/validateCategoriesService";
import { Category } from "@/shared.types";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

        const categories = await getUserCategories(userId);
        return NextResponse.json(categories, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

        const res = await request.json();
        const name: string = res["name"];

        const category: Category = 
        {
            categoryId: null,
            userId : userId,
            name : name.trim()
        }  

        const validationResult = await validateCategoriesService(category);
        if (!validationResult.isValid)
        {
            return NextResponse.json({ message: validationResult.message }, { status: 400 }); 
        }

        const result = await createCategory(category);
        
        if (result && result > 0) {
            return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
        }


    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}