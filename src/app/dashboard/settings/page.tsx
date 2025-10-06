import { DashboardWidget } from "@/components/dashboard/DashboardWidget";

export default async function Page() {
    return (
        <div>
            <h1>Settings</h1>
            <DashboardWidget title="General">
                <p>This will be where general settings are changed.</p>
            </DashboardWidget>
            <DashboardWidget title="Category">
                <p>This will be where user category settings are changed.</p>
            </DashboardWidget>
        </div>)
}