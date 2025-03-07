import { getCategories } from "@/db/categories/getCategories";
import { NextResponse } from "next/server";

export async function GET() {

    try {
        const categories = await getCategories();
        return NextResponse.json(categories, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}