import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import { Tabs } from "@/components/tabs/Tabs";

export default async function Page() {
    return (
        <div>
            <DashboardWidget title="Settings">
                <Tabs tabs={[
                    {
                        label: "General",
                        content:
                            <p>This will be where general settings are changed.</p>
                    },
                    {
                        label: "Categories",
                        content:
                            <p>This will be where user category settings are changed.</p>

                    }
                ]} />
            </DashboardWidget>
        </div>)
}