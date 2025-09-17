"use client"

import ResourceForm from "@/components/resource-form/ResourceForm";
import { FormState } from "@/constants/constants";
import { useParams } from "next/navigation";

export default function Page() {
    const params = useParams();
    const resourceId = params["resource-id"] as string;

    return (<ResourceForm state={FormState.EDIT} resourceId={resourceId} />)
}