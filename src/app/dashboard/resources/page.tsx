"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import ResourceListings from '@/components/resource-listings/ResourceListings';

export default function Page() {

    return (
        <div>
            <h1>Resources Page</h1>
            <DashboardWidget title="Resources">
                <ResourceListings />
            </DashboardWidget>
        </div>)
}