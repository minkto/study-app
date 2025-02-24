"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import { Resource } from '@/shared.types';
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
                
            </DashboardWidget>
            <h2>Resource Listing Component</h2>
            <ul>
                {
                    resources?.map((resources: Resource) => (
                        <li key={resources.resourceId}>{resources.name}, {resources?.description}</li>
                    ))
                }
            </ul>
           
        </div>)
}

export default Page