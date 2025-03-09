"use client";

import ChapterForm from "@/components/chapter-form/ChapterForm"
import { FormState } from "@/constants/constants";
import { useParams } from "next/navigation";

const Page = () =>
{
    const params = useParams();
    const resourceId = params["resource-id"] as string;

    return(<ChapterForm resourceId={resourceId} formState={FormState.ADD}/>)
}

export default Page;