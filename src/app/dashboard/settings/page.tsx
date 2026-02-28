import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import ListingsSearchBox from "@/components/listings-search-box/ListingsSearchBox";
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
                            <ListingsSearchBox/>

                    }
                ]} />
            </DashboardWidget>
        </div>)
}