"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import { Suspense } from 'react';

export default function Page() {

    return (
        <Suspense fallback={<>...</>}>
            <div>
                <h1>Resources Page</h1>
                <DashboardWidget title="Resources">
                    <ResourceListings />
                </DashboardWidget>
            </div>
        </Suspense>)
}