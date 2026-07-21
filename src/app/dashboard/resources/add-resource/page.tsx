import ResourceForm from '@/components/resource-form/ResourceForm';
import { FormState } from '@/constants/constants';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Add Resource | LearnLobe',
  description: 'Add a new resource.',
}

export default function Page() {

    return (<ResourceForm state={FormState.ADD} />)
}