import ResourceForm from "@/components/resource-form/ResourceForm";
import { FormState } from "@/constants/constants";
import { getResource } from "@/db/resources/getResource";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {

    const { "resource-id": resourceId } = await params;

    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const resource = await getResource(Number(resourceId),userId);
    if(!resource)
    {
        return notFound();
    }

    return (resource && <ResourceForm state={FormState.EDIT} resource={resource} />)
}