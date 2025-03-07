"use client"

import ResourceForm from "@/components/resource-form/ResourceForm";
import { FormState } from "@/constants/constants";
import { useParams } from "next/navigation";

const Page = () => 
{
    const params = useParams();
    const resourceId = params["resource-id"] as string;

    return(<ResourceForm state={FormState.EDIT} resourceId={resourceId}/>)
}  

export default Page;