import { createUserSettings } from "@/db/users/settings/createUserSettings";
import { initializeCurrentAppUser, redirectToSignInPage } from "@/services/auth/userService";
import { SignOutButton } from "@clerk/nextjs";
import { redirect } from "next/navigation";

export default async function Page() {

    const currentUser = await initializeCurrentAppUser();

    if (!currentUser) {
        redirectToSignInPage();
        return;
    }

    try {
        const { userId } = currentUser;
        await createUserSettings({ userId: userId });
    }
    catch (err) {
        console.error("Error while checking or creating user settings: ", err);
        return (
            <div>
                <p>
                    An unexpected error has occurred while finalizing your
                    settings. Please try again later.
                </p>

                <SignOutButton redirectUrl="/auth/sign-in">
                    <button
                        className="dashboard-primary-btn"
                        title="Logout"
                        aria-label="Logout"
                    >
                        Sign Out
                    </button>
                </SignOutButton>
            </div>
        );
    }
    redirect('/dashboard');
}