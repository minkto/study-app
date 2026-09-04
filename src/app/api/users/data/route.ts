import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { deleteUserData } from "@/db/users/deleteUserData";
import { NextResponse } from "next/server";

export const DELETE = withApiErrorHandling(async (currentUser: AppUser) => {
    await deleteUserData(currentUser.userId);
    return new NextResponse(null, { status: 204 });
});
