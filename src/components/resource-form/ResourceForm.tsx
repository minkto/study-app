"use client"

import { FormState } from '@/constants/constants';
import { Category, Resource } from '@/shared.types';
import Form from 'next/form'
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';


interface ResourceFormProps {
    state?: number;
    resourceId?: string;
}

const ResourceForm = ({ state, resourceId }: ResourceFormProps) => {

    const [formErrors, setFormErrors] = useState({
        nameError: "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [formData, setFormData] = useState<Resource>({
        name: "",
        categoryId: -1,
        description: "",
        isPinned: false
    });

    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if(event.target.type === "checkbox" && event.target instanceof HTMLInputElement)
        {
            setFormData({ ...formData, [event.target.name]:  event.target.checked});
        }
        else
        {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    }

    const isFormValid = (): boolean => {
        let result = true;
        if (!formData.name) {
            setFormErrors({ ...formErrors, nameError: "The 'Name' field is a mandatory field." });
            result = false;
        }
        else {
            setFormErrors({ ...formErrors, nameError: "" });
        }

        return result;
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        // If nothing was changed on dropdown, take the first value.
        if (categories?.length > 0 &&
            formData.categoryId !== undefined &&
            formData.categoryId <= -1 &&
            categories[0]?.categoryId) {
            formData.categoryId = categories[0]?.categoryId;
        }

        if (!isFormValid()) {
            return;
        }

        try {
            setButtonDisabled(true);
            const response = await fetch('/api/resources', {
                method: state === FormState.ADD ? 'POST' : 'PUT',
                body: JSON.stringify(formData),
            });

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }

            router.push('/dashboard/resources');
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        const getCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                const data: Category[] = await response.json();
                setCategories(data);

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        }

        const loadResourceDetails = async () => {
            try {
                const response = await fetch(`/api/resources/${resourceId}`);
                const data: Resource = await response.json();
                setFormData(data);

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        }

        switch (state) {
            case FormState.ADD:
                getCategories();
                break;
            case FormState.EDIT:
                getCategories();
                loadResourceDetails();
                break;
        }

    }, [resourceId, state]);

    return (<div className="form-container">
        <div className="form-header">
            <h1 className='form-header__title'>{state === FormState.ADD ? "Add" : "Edit"} Resource</h1>
        </div>
        <div className='form-inner-content'>
            <Form className='form-dashboard' action="/dashboard/resources" onSubmit={onSubmit}>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__name'>Name</label>
                    <input className="form-field" id="form-resource__name" name="name" type='text' onChange={handleChange} value={formData?.name}></input>
                    {formErrors.nameError ? (<p className='form-field__error-message'>{formErrors.nameError}</p>) : null}
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__category'>Categories</label>
                    <select className="form-field" id='form-resource__category' name="categoryId" onChange={handleChange}
                        value={formData?.categoryId ?? -1 }
                    >
                        {
                            categories?.map((c: Category) =>
                                (<option key={c.categoryId} value={c.categoryId ?? -1}>{c.name}</option>)
                            )}
                    </select>
                </div>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__description'>Description</label>
                    <textarea className="form-field" id="form-resource__description" rows={5} name="description" onChange={handleChange} value={formData?.description} />
                </div>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-chapter__is-pinned'>Pinned</label>
                    <input type="checkbox" className="form-field" id="form-chapter__is-pinned" name="isPinned" onChange={handleChange} />
                </div>
                <div className="form-field-wrapper centered-fields">
                    <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                </div>
            </Form>
        </div>
    </div>)
};

export default ResourceForm;