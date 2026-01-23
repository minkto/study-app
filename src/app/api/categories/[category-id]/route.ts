import { deleteCategory } from "@/db/categories/deleteCategory";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";


export async function DELETE(_request: Request, { params }: { params: Promise<{ 'category-id': string }> }) {
    try {
        const { userId } = await auth();
        
        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }
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