"use client"
import ResourceForm from '@/components/resource-form/ResourceForm';
import { FormState } from '@/constants/constants';

const Page = () => {

    return (<ResourceForm state={FormState.ADD} />)
}

export default Page;