import { DEFAULT_CATEGORY_COLOR } from "@/constants/constants";
import { createCategory } from "@/db/categories/createCategory";
import { getCategory } from "@/db/categories/getCategory";
import { getUserCategories, getUserCategoriesPageCount } from "@/db/categories/getUserCategories";
import { updateCategory } from "@/db/categories/updateCategory";
import validateCategoriesService from "@/services/validateCategoriesService";
import { AppUser, Category, GetCategoriesApiResponse, ListingSearchQuery } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { removeWhitespace } from "@/utils/stringUtils";
import { NextRequest, NextResponse } from "next/server";

export const GET = withApiErrorHandling(async (currentUser: AppUser, request: NextRequest) => {

    const searchParams = request.nextUrl.searchParams;
    const listingSearchQuery: ListingSearchQuery =
    {
        searchTerm: searchParams?.get('search-term')?.trim(),
        sortBy: searchParams?.get('sortBy')?.trim(),
        sortOrder: searchParams?.get('sortOrder')?.trim(),
        page: searchParams?.get('page')?.trim(),
        pageSize: searchParams?.get('pageSize')?.trim(),
        userId: currentUser.userId
    };

    const categories = await getUserCategories(listingSearchQuery);
    if (!categories) {
        return NextResponse.json({ message: "No Categories found.", categories: [], count: 0 }, { status: 404 });
    }

    const response: GetCategoriesApiResponse =
    {
        categories: categories,
        count: await getUserCategoriesPageCount(listingSearchQuery)
    }

    return NextResponse.json(response, { status: 200 });
});

export const POST = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const res = await request.json();

    const category: Category =
    {
        categoryId: null,
        userId: currentUser.userId,
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

    return NextResponse.json({ message: 'No category was created.' }, { status: 400 });
});

export const PUT = withApiErrorHandling(async (currentUser: AppUser, request: Request) => {

    const categoryRequestBody: Category = await request.json();
    const categoryId = Number(categoryRequestBody.categoryId);

    const categoryFromDb: Category | null = await getCategory(categoryId, currentUser.userId);

    if (!categoryFromDb) {
        return NextResponse.json({ message: 'No category was found for the user.' }, { status: 404 });
    }

    categoryFromDb.name = removeWhitespace(categoryRequestBody.name);
    categoryFromDb.description = removeWhitespace(categoryRequestBody.description);
    categoryFromDb.color = removeWhitespace(categoryRequestBody.color) ?? DEFAULT_CATEGORY_COLOR;

    const validationResult = await validateCategoriesService(categoryFromDb);
    if (!validationResult.isValid) {
        return NextResponse.json({ message: validationResult.message }, { status: 400 });
    }

    const result = await updateCategory(categoryFromDb);

    if (result) {
        return NextResponse.json({ message: 'Category updated successfully.' }, { status: 200 });
    }

    return NextResponse.json({ message: 'No category was updated.' }, { status: 404 });
});