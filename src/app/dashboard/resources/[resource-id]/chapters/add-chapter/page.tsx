import ChapterForm from "@/components/chapter-form/ChapterForm"
import { FormState } from "@/constants/constants";
import resourceWithUserExists from "@/db/resources/resourceWithUserExists";
import { getCurrentAppUser, redirectToSignInPage } from "@/services/auth/userService";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Add Chapter | LearnLobe',
  description: 'Add a chapter to the current resource.',
}

export default async function Page({ params }: { params: Promise<{ "resource-id": string }> }) {

    const { "resource-id": resourceId } = await params;

    const currentUser = await getCurrentAppUser();

    if (!currentUser) {
        redirectToSignInPage();
        return;
    }

    const { userId } = currentUser;

    const resourceExists = await resourceWithUserExists(Number(resourceId), userId);
    if (!resourceExists) {
        return notFound();
    }

    return (resourceExists && <ChapterForm chapter={{ name: "", resourceId: Number(resourceId) }} formState={FormState.ADD} />)
}