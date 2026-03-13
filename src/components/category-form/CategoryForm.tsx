"use client"

import { DEFAULT_CATEGORY_COLOR, FormState } from "@/constants/constants";
import { Category } from "@/shared.types";
import Form from "next/form"
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from "sonner";
import { HexColorPicker } from "react-colorful";


interface CategoryFormProps {
    state?: number;
    categoryId?: number;
    onFormSubmit?: () => void;
}
export const CategoryForm = ({ categoryId, onFormSubmit, state }: CategoryFormProps) => {

    const [formErrors, setFormErrors] = useState({
        nameError: "",
        colorError: ""
    });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [formData, setFormData] = useState<Category>({
        name: "",
        categoryId: -1,
        description: "",
        color: DEFAULT_CATEGORY_COLOR,
        userId: -1
    });

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {

        try {
            event.preventDefault();

            setButtonDisabled(true);

            if (!isFormValid()) {
                return;
            }

            const response = await fetch('/api/categories', {
                body: JSON.stringify(formData),
                method: state === FormState.ADD ? 'POST' : 'PUT'
            })


            if (!response.ok) {

                if (response.status === 400) {
                    const responseMessage = await response.json();
                    toast.error('Error', { closeButton: true, description: responseMessage.message });
                    return;
                }

                toast.error('Error', { closeButton: true, description: 'An issue has occured while saving category. Please try again later.' })
                throw new Error('Failed to submit the data. Please try again.');
            }

            toast.success('Success', { closeButton: true, description: 'Category was saved successfully.' })
            if (onFormSubmit !== undefined) {
                onFormSubmit();
            }
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
        finally {
            setButtonDisabled(false);
        }
    }


    const isFormValid = (): boolean => {
        const errors = { nameError: "", colorError: "" };

        if (!formData.name) {
            errors.nameError = "The 'Name' field is a mandatory field.";
        }

        const colorHexReg = /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/;
        if (!colorHexReg.test(formData.color)) {
            errors.colorError = "A valid hex value is required.";
        }

        setFormErrors(errors);
        return !errors.nameError && !errors.colorError;
    };


    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (event.target.type === "checkbox" && event.target instanceof HTMLInputElement) {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        }
        else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    }

    const handleColorPickerChange = (newColor: string) => {
        setFormData({ ...formData, color: newColor });
    }

    useEffect(() => {
        const getCategory = async () => {
            try {
                if (!categoryId) {
                    return;
                }
                const response = await fetch(`/api/categories/${categoryId}`);
                const data = await response.json();
                if (response.ok) {
                    setFormData(data);
                }
            }
            catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        }

        switch (state) {
            case FormState.ADD:
                break;
            case FormState.EDIT:
                getCategory();
                break;
        }

    }, [categoryId, state])

    return (<div className="form-container">
        <div className='form-inner-content'>
            <Form className='form-dashboard' action="/dashboard/settings" onSubmit={onSubmit}>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-category__name'>Name</label>
                    <input className="form-field" id="form-category__name" name="name" type='text' onChange={handleChange} value={formData?.name ?? ""}></input>
                    {formErrors.nameError ? (<p className='form-field__error-message'>{formErrors.nameError}</p>) : null}
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-category__description'>Description</label>
                    <textarea className="form-field" id="form-category__description" rows={5} name="description" onChange={handleChange} value={formData?.description ?? ""} />
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-category__color'>Color</label>
                    <HexColorPicker color={formData?.color ?? DEFAULT_CATEGORY_COLOR} onChange={handleColorPickerChange} />
                    <input id="form-category__color" name="color" maxLength={7} className="form-field" type="text" value={formData.color} onChange={handleChange} />
                    {formErrors.colorError ? (<p className='form-field__error-message'>{formErrors.colorError}</p>) : null}
                </div>

                <div className="form-field-wrapper centered-fields">
                    <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                </div>
            </Form>
        </div>
    </div>)
} 