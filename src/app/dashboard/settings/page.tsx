import CategoryListings from "@/components/category-listings/CategoryListings";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import SettingsForm from "@/components/settings-form/SettingsForm";
import { Tabs } from "@/components/tabs/Tabs";
import { getCurrentAppUser, redirectToSignInPage } from "@/services/auth/userService";
import { Metadata } from "next";

export const metadata: Metadata = {
    title: 'Settings | LearnLobe',
    description: 'View and change user settings for the application.',
}

export default async function Page() {

    const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        await redirectToSignInPage();
        return;
    }

    const { userId } = currentUser;


    return (
        <div>
            <DashboardWidget title="Settings">
                <Tabs tabs={[
                    {
                        label: "General",
                        content:
                            <div>
                                <SettingsForm userId={userId} />
                            </div>
                    },
                    {
                        label: "Categories",
                        content:
                            <CategoryListings useQueryParams={false} />

                    }
                ]} />
            </DashboardWidget>
        </div>)
}