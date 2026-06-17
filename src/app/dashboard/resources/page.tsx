"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import { Suspense } from 'react';

export default function Page() {

    return (
        <Suspense fallback={<>...</>}>
            <div>
                <DashboardWidget title="Resources">
                    <ResourceListings />
                </DashboardWidget>
            </div>
        </Suspense>)
}