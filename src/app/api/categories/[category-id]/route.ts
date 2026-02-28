import { deleteCategory } from "@/db/categories/deleteCategory";
import { getCategory } from "@/db/categories/getCategory";
import { updateCategory } from "@/db/categories/updateCategory";
import { getCurrentAppUser } from "@/services/auth/userService";
import validateCategoriesService from "@/services/validateCategoriesService";
import { Category } from "@/shared.types";
import { removeWhitespace } from "@/utils/stringUtils";
import { NextResponse } from "next/server";


export async function GET(_request: Request, { params }: { params: Promise<{ 'category-id': string }> }) {

    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;
        const categoryId = (await params)['category-id'];
        const category = await getCategory(categoryId, userId);

        if (!category) {
            return NextResponse.json({ message: 'No category was found for the user.' }, { status: 404 });
        }

        return NextResponse.json(category, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}

export async function DELETE(_request: Request, { params }: { params: Promise<{ 'category-id': string }> }) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;
        const categoryId = (await params)['category-id'];
        const result = await deleteCategory(categoryId, userId);

        if (result && result > 0) {
            return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
        }

        return NextResponse.json({ message: 'No category was deleted' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}

export async function PUT(request: Request, { params }: { params: Promise<{ 'category-id': string }> }) {
    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;
        const categoryId = (await params)['category-id'];
        const categoryRequestBody: Category = await request.json();

        const categoryFromDb: Category | null = await getCategory(categoryId, userId);

        if (!categoryFromDb) {
            return NextResponse.json({ message: 'No category was found for the user.' }, { status: 404 });
        }

        categoryFromDb.name = removeWhitespace(categoryRequestBody.name);

        const validationResult = await validateCategoriesService(categoryFromDb);
        if (!validationResult.isValid) {
            return NextResponse.json({ message: validationResult.message }, { status: 400 });
        }

        const result = await updateCategory(categoryFromDb);

        if (result) {
            return NextResponse.json({ message: 'Category updated successfully.' }, { status: 200 });
        }

        return NextResponse.json({ message: 'No category was updated.' }, { status: 404 });

    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}