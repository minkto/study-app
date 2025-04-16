"use client";

import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import IconPlus from "@/components/icons/icon-plus/IconPlus";
import ListingsSearchBox from "@/components/listings-search-box/ListingsSearchBox";
import ListingsSearchFilterOptions from "@/components/listings-search-filter-options/ListingsSearchFilterOptions";
import ResourceChaptersListings from "@/components/resource-chapters-listings/ResourceChaptersListings";
import Link from "next/link";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();

    const resourceId = params["resource-id"] as string ;

    return (
        <div>
            <h1>Selected Resource Chapters Page</h1>
            <DashboardWidget title="Resource Chapters">
                <div className='dashboard__widget-row'>
                    <ListingsSearchBox/>
                    <ListingsSearchFilterOptions/>
                    <Link className='dashboard-primary-btn' href={'chapters/add-chapter'}><IconPlus width={24} height={24} />Add</Link>
                </div>
                <ResourceChaptersListings resourceId={resourceId} />
            </DashboardWidget>
        </div>);
}

export default Page;