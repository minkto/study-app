import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Resource Listings | LearnLobe',
    description: 'View all the resources.',
}

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