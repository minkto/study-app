import { DEFAULT_CATEGORY_COLOR, ListingPageSizes } from "@/constants/constants";
import { createCategory } from "@/db/categories/createCategory";
import { getUserCategories } from "@/db/categories/getUserCategories";
import { calculatePageCount } from "@/db/queryBuilder";
import { getCurrentAppUser } from "@/services/auth/userService";
import validateCategoriesService from "@/services/validateCategoriesService";
import { Category, GetCategoriesApiResponse, ListingSearchQuery } from "@/shared.types";
import { removeWhitespace } from "@/utils/stringUtils";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {

    try {
        const currentUser = await getCurrentAppUser();

        if (!currentUser) {
            return new Response(
                JSON.stringify({ error: "Unauthorized" }),
                { status: 401 }
            );
        }

        const { userId } = currentUser;

        const searchParams = request.nextUrl.searchParams;
        const listingSearchQuery: ListingSearchQuery =
        {
            searchTerm: searchParams?.get('search-term')?.trim(),
            sortBy: searchParams?.get('sortBy')?.trim(),
            sortOrder: searchParams?.get('sortOrder')?.trim(),
            page: searchParams?.get('page')?.trim(),
            userId: userId
        };

        const categories = await getUserCategories(listingSearchQuery);

        const response: GetCategoriesApiResponse =
        {
            categories: categories,
            count: await calculatePageCount(
                listingSearchQuery,
                Number(process.env.CATEGORIES_MAX_PAGE_SIZE ?? ListingPageSizes.CATEGORIES),
                `SELECT COUNT(*) FROM categories c WHERE c.user_id = $1`,
                [listingSearchQuery.userId],
            )
        }

        return NextResponse.json(response, { status: 200 });
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

        const category: Category =
        {
            categoryId: null,
            userId: userId,
            name: removeWhitespace(res["name"]),
            description: removeWhitespace(res["description"]),
            color: removeWhitespace(res["color"]) ?? DEFAULT_CATEGORY_COLOR
        }

        const validationResult = await validateCategoriesService(category);
        if (!validationResult.isValid) {
            return NextResponse.json({ message: validationResult.message }, { status: 400 });
        }

        const result = await createCategory(category);

        if (result && result > 0) {
            return NextResponse.json({ message: 'Category created successfully.' }, { status: 201 });
        }


    } catch (error) {
        return NextResponse.json({ message: 'API Error', error }, { status: 500 });
    }
}