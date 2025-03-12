"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import IconPlus from '@/components/icons/icon-plus/IconPlus';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import Link from 'next/link';

const Page = () => {

    return (
        <div>
            <h1>Resources Page</h1>
            <DashboardWidget title="Resources">
                <div className='dashboard__widget-row row-reverse'>
                    <Link className='dashboard-primary-btn' href={'resources/add-resource'}><IconPlus width={24} height={24}/>Add</Link>
                </div>
                <ResourceListings />
            </DashboardWidget>
        </div>)
}

export default Page;