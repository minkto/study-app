import { getUserByClerkUserId } from "@/db/users/getUser";
import { AppUser } from "@/shared.types";
import { auth } from "@clerk/nextjs/server";

export const getCurrentAppUser = async (): Promise<AppUser | null> => {
    const { userId } = await auth();

    return await getUserByClerkUserId(userId);
}