"use client"

import { Category } from '@/shared.types';
import Form from 'next/form'
import { useRouter } from 'next/navigation';
import { ChangeEvent, FormEvent, useEffect, useState } from 'react';

const ResourceForm = () => {
    const [formErrors, setFormErrors] = useState({
        nameError: "",
    });

    const [categories, setCategories] = useState<Category[]>([]);
    const [buttonDisabled, setButtonDisabled] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        categoryId: -1,
        description: "",
    });
    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const isFormValid = () => {
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
                method: 'POST',
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

        getCategories();

    }, []);

    return (<div className="form-container">
        <div className="form-header">
            <h1 className='form-header__title'>Add Resource</h1>
        </div>
        <div className='form-inner-content'>
            <Form className='form-dashboard' action="/dashboard/resources" onSubmit={onSubmit}>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__name'>Name</label>
                    <input className="form-field" id="form-resource__name" name="name" type='text' onChange={handleChange}></input>
                    {formErrors.nameError ? (<p className='form-field__error-message'>{formErrors.nameError}</p>) : null}
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__category'>Categories</label>
                    <select className="form-field" id='form-resource__category' name="categoryId" onChange={handleChange}>
                        {categories?.map((c: Category) =>
                            (<option key={c.categoryId} value={c.categoryId ?? -1}>{c.name}</option>)
                        )}
                    </select>
                </div>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-resource__description'>Description</label>
                    <textarea className="form-field" id="form-resource__description" rows={5} name="description" onChange={handleChange}></textarea>
                </div>
                <div className="form-field-wrapper centered-fields">
                    <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                </div>
            </Form>
        </div>
    </div>)
};

export default ResourceForm;