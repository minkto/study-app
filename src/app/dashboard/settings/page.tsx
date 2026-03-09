import CategoryListings from "@/components/category-listings/CategoryListings";
import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import SettingsForm from "@/components/settings-form/SettingsForm";
import { Tabs } from "@/components/tabs/Tabs";
import { currentUser } from "@clerk/nextjs/server";

export default async function Page() {

    const user = await currentUser();

    return (
        <div>
            <DashboardWidget title="Settings">
                <Tabs tabs={[
                    {
                        label: "General",
                        content:
                            <div>
                                <SettingsForm userId={user?.id} />
                            </div>
                    },
                    {
                        label: "Categories",
                        content:
                            <CategoryListings/>

                    }
                ]} />
            </DashboardWidget>
        </div>)
}