"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import ResourceListings from '@/components/resource-listings/ResourceListings';
import { useEffect, useState } from 'react';

const Page = () => {
    const [resources, setResource] = useState([]);

    useEffect(() => {
        try {
            fetch('/api/resources')
                .then((res) => res.json())
                .then((data) => setResource(data))
        } catch (error) {
            console.log("An error has occured in the API: ", error);
        }
    }, [])

    console.log(resources);

    return (
        <div>
            <h1>Resources Page</h1>
            <DashboardWidget title="Resources">
                <ResourceListings resources={resources} />
            </DashboardWidget>
        </div>)
}

export default Page;