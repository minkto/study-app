"use client";

import ResourceChaptersListings from "@/components/resource-chapters-listings/ResourceChaptersListings";
import { useParams } from "next/navigation";

const Page = () => {
    const params = useParams();
    const resourceId = params["resource-id"] as string;

    return (
        <div>
            <h1>Selected Resource Chapters Page</h1>
            <ResourceChaptersListings resourceId={resourceId} />
        </div>);
}

export default Page;