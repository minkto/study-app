import { DashboardWidget } from "@/components/dashboard/DashboardWidget";
import ResourceChaptersListings from "@/components/resource-chapters-listings/ResourceChaptersListings";
import { getCurrentAppUser, redirectToSignInPage } from "@/services/auth/userService";
import { getResourceDto } from "@/services/resourceService";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Chapter Listings | LearnLobe',
  description: 'View all the chapters belonging to the current resource.',
}

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {
    const { "resource-id": resourceId } = await params;


const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        redirectToSignInPage();
        return;
    }

    const { userId } = currentUser;

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