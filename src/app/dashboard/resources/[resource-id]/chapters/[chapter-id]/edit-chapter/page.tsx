import ChapterForm from "@/components/chapter-form/ChapterForm";
import { FormState } from "@/constants/constants";
import { getChapter } from "@/db/chapters/getChapter";
import { Chapter } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { auth } from "@clerk/nextjs/server";
import { Metadata } from "next";
import { notFound } from "next/navigation";

export const metadata: Metadata = {
  title: 'Edit Chapter | LearnLobe',
  description: 'Edit an existing chapter',
}

export default async function Page({ params }: { params: Promise<{ "chapter-id": string }> }) {

    const { "chapter-id": chapterId } = await params;
    const { userId, redirectToSignIn } = await auth();
    if (isStringEmpty(userId)) {
        redirectToSignIn();
    }

    const loadChapterDetails = async (): Promise<Chapter | undefined | null> => {
        try {

            const chapterIdNum = Number(chapterId);
            const response = await getChapter(chapterIdNum, userId);

            return response;

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    }

    const chapter = await loadChapterDetails();
    if (!chapter) {
        return notFound();
    }

    return (chapter && <ChapterForm chapter={chapter} formState={FormState.EDIT} />)
}