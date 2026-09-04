import { AppUser } from "@/shared.types";
import { withApiErrorHandling } from "@/utils/apiErrorHandler";
import { deleteUserHandler } from "@/utils/deleteUserHandler";

export const DELETE = withApiErrorHandling(async (currentUser: AppUser) => {
    return await deleteUserHandler(currentUser);
});