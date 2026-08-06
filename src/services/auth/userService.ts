import { createUserFromClerk } from "@/db/users/createUser";
import { getUserByClerkUserId } from "@/db/users/getUser";
import { AppUser } from "@/shared.types";
import { auth } from "@clerk/nextjs/server";

export const getCurrentAppUser = async (): Promise<AppUser | null | undefined> => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    return await getUserByClerkUserId(userId);
};

export const initializeCurrentAppUser = async () => {
    const { userId } = await auth();

    if (!userId) {
        return null;
    }

    let user = await getUserByClerkUserId(userId);

    if (!user) {
        user = await createUserFromClerk(userId);
    }

    return user;
};

export const redirectToSignInPage = async () => {
    const { redirectToSignIn } = await auth();
    redirectToSignIn();
}