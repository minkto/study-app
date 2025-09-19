"use client"
import ResourceForm from '@/components/resource-form/ResourceForm';
import { FormState } from '@/constants/constants';

export default function Page() {

    return (<ResourceForm state={FormState.ADD} />)
}