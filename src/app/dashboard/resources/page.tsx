"use client";

import { DashboardWidget } from '@/components/dashboard/DashboardWidget';
import { useEffect, useState } from 'react';

const Page = () => {
    const [resources, setResource] = useState([]);

    useEffect(() => {
        fetch('api/resources/getResource')
            .then((res) => res.json())
            .then((data) => setResource(data))
        console.log(resources);
    }, [])

    return (
        <div>
            <h1>Resources Page</h1>
            <DashboardWidget title="Resources">
            </DashboardWidget>
            <ul>
                {/* eslint-disable @typescript-eslint/no-explicit-any */
                    resources.map((resources: any) => (
                        <li key={resources.version}>{resources.version}</li>
                    ))}
            </ul>
        </div>)
}

export default Page