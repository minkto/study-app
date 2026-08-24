import { deleteCategory } from "@/db/categories/deleteCategory";
import { getCategory } from "@/db/categories/getCategory";
import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ 'category-id': string }> }) => {

    const categoryId = (await params)['category-id'];
    const category = await getCategory(Number(categoryId), currentUser.userId);

    if (!category) {
        return NextResponse.json({ message: 'No category was found for the user.' }, { status: 404 });
    }

    return NextResponse.json(category, { status: 200 });
});

export const DELETE = withApiErrorHandling(async (currentUser: AppUser, _request: Request, { params }: { params: Promise<{ 'category-id': string }> }) => {

    const categoryId = (await params)['category-id'];
    const result = await deleteCategory(categoryId, currentUser.userId);

    if (result && result > 0) {
        return NextResponse.json({ message: 'Category deleted successfully' }, { status: 200 });
    }

    return NextResponse.json({ message: 'No category was deleted' }, { status: 404 });
});
