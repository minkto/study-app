import { createCategory } from "@/db/categories/createCategory";
import { getUserCategories } from "@/db/categories/getUserCategories";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const categories = await getUserCategories(userId);
        return NextResponse.json(categories, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}

export async function POST(request: Request) {
    try {
        const { userId } = await auth();

        if (isStringEmpty(userId)) {
            return new Response("Unauthorized", { status: 401 });
        }

        const res = await request.json();
        const name: string = res["name"];

        const result = await createCategory(name, userId);
        if (result && result > 0) {
            return NextResponse.json({ message: 'Category created successfully' }, { status: 201 });
        }


    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}