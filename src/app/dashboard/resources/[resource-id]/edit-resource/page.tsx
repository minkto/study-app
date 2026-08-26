import ResourceForm from "@/components/resource-form/ResourceForm";
import { FormState } from "@/constants/constants";
import { getResource } from "@/db/resources/getResource";
import { getCurrentAppUser, redirectToSignInPage } from "@/services/auth/userService";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
    title: 'Edit Resource | LearnLobe',
    description: 'Edit an existing resource.',
}

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {

    const { "resource-id": resourceId } = await params;

    const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        await redirectToSignInPage();
        return;
    }

    const { userId } = currentUser;
    const resource = await getResource(Number(resourceId), userId);
    if (!resource) {
        return notFound();
    }

    return (resource && <ResourceForm state={FormState.EDIT} resource={resource} />)
}