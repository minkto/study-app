import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import EllipsesLoader from '@/components/loaders/ellipses-loader/EllipsesLoader';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import { Metadata } from 'next';
import { Suspense } from 'react';

export const metadata: Metadata = {
    title: 'Resource Listings | LearnLobe',
    description: 'View all the resources.',
}

export default function Page() {

    return (
        <Suspense fallback={<EllipsesLoader message='Loading Dashboard'></EllipsesLoader>}>
            <div>
                <DashboardWidget title="Resources">
                    <ResourceListings />
                </DashboardWidget>
            </div>
        </Suspense>)
}