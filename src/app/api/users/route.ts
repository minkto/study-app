import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { deleteUserHandler } from "@/utils/deleteUserHandler";

export const DELETE = withApiErrorHandling(async (_currentUser: AppUser, request: Request) => {

    const body = await request.json();

    return await deleteUserHandler(body?.skipClerkDeletion ?? false);
});