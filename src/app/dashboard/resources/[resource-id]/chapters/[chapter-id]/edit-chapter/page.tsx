"use client";

import ChapterForm from "@/components/chapter-form/ChapterForm";
import { FormState } from "@/constants/constants";
import { useParams } from "next/navigation";

export const Page = () => 
{
    const params = useParams();
    const resourceId = params["resource-id"] as string;
    const chapterId = params["chapter-id"] as string;

    return(<ChapterForm resourceId={resourceId} chapterId={chapterId}  formState={FormState.EDIT}/>)
}

export default Page;