import ChapterForm from "@/components/chapter-form/ChapterForm"
import { FormState } from "@/constants/constants";
import resourceWithUserExists from "@/db/resources/resourceWithUserExists";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { notFound } from "next/navigation";

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {

    const { "resource-id": resourceId } = await params;

    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const resourceExists = await resourceWithUserExists(Number(resourceId), userId);
    if (!resourceExists) {
        return notFound();
    }

    return (resourceExists && <ChapterForm chapter={{ name: "", resourceId: Number(resourceId) }} formState={FormState.ADD} />)
}