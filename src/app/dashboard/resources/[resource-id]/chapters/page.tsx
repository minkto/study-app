"use client";

import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import ResourceChaptersListings from "@/components/resource-chapters-listings/ResourceChaptersListings";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();

    const resourceId = params?.["resource-id"] as string;

    return (
        <div>
            <DashboardWidget title="Resource Chapters">
                <ResourceChaptersListings pageSize={10} resourceId={resourceId} />
            </DashboardWidget>
        </div>);
}