import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import ResourceChaptersListings from "@/components/resource-chapters-listings/ResourceChaptersListings";
import { getResourceDto } from "@/services/resourceService";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Chapter Listings | LearnLobe',
  description: 'View all the chapters belonging to the current resource.',
}

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {
    const { "resource-id": resourceId } = await params;


    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const resource = await getResourceDto(Number(resourceId), userId);
    if(!resource)
    {
        return notFound();
    }

    return (
        <div>
            <h1>{resource?.name}</h1>
            <DashboardWidget>
                <ResourceChaptersListings pageSize={10} resourceId={resourceId} />
            </DashboardWidget>
        </div>);
}