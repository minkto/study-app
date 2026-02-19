'use client'

import { UserSettings, UserSettingsFormErrors } from "@/shared.types";
import Form from "next/form";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";
import { toast } from 'sonner';
import EllipsesLoader from "../loaders/ellipses-loader/EllipsesLoader";

interface SettingsFormProps {
    userId?: string;
}

const SettingsForm = ({ userId }: SettingsFormProps) => {

    const FORM_SUCCESS_MESSAGE = 'Changes have been successfully saved.';
    const FORM_FAILED_MESSAGE = 'An issue has occured. Please try again.'

    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);

    const [formData, setFormData] = useState<UserSettings>(
        {
            aiHelperCredits: 0,
            userId: -1,
            globalChapterDaysBeforeReviewDue: 30,
            userSettingId: - 1
        });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [formErrors, setFormErrors] = useState<UserSettingsFormErrors>(
        {
            userIdErrors: '',
            globalChapterDaysBeforeReviewDueErrors: ''
        });


    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (event.target.type === "checkbox" && event.target instanceof HTMLInputElement) {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        }
        else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    }

    const isFormValid = (): boolean => {
        let result = true;

        if (!formData.globalChapterDaysBeforeReviewDue ||
            formData.globalChapterDaysBeforeReviewDue <= 0) {
            setFormErrors({ ...formErrors, globalChapterDaysBeforeReviewDueErrors: "Value must be greater than 0." });
            result = false;
        }
        else {
            setFormErrors({ ...formErrors, globalChapterDaysBeforeReviewDueErrors: "" });
            result = true;
        }

        return result;
    };

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setButtonDisabled(true);

            if (!isFormValid()) {
                return;
            }

            const response = await fetch(`/api/users/settings`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                toast.error('Error', { closeButton: true, description: FORM_FAILED_MESSAGE })
                throw new Error('Failed to submit the data. Please try again.')
            }

            toast.success('Success', { closeButton: true, description: FORM_SUCCESS_MESSAGE })
        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        } finally {
            setButtonDisabled(false);
        }
    }

    useEffect(() => {
        const getUserDetails = async () => {
            try {
                const response = await fetch(`/api/users/settings`);
                const data = await response.json();

                if (!response.ok) {
                    setIsError(true);
                    setIsLoading(false);
                    return;
                }

                setFormData(data);
                setIsError(false);

                return data;

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                    setIsError(true);
                }
            }
            finally {
                setIsLoading(false);
            }
        }

        getUserDetails();

    }, [userId])


    const renderForm = () => {
        if (isError) {
            return <div>
                <p>An error has occured.</p>
            </div>
        }
        else {
            return <Form className='form-dashboard' onSubmit={onSubmit} action={`/dashboard/settings`}>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-settings__ai-helper-credits'>AI Helper Credits</label>
                    <input disabled className="form-field" id="form-settings__ai-helper-credits" name="ai-helper-credits" type='text' onChange={handleChange} value={formData?.aiHelperCredits ?? 0}></input>
                    <p>This amount of current credit available to be used.</p>
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-settings__global_chapter_days_before_review_due'>Global chapter days before review due</label>
                    <input className="form-field" id="form-settings__global_chapter_days_before_review_due" name="globalChapterDaysBeforeReviewDue" type='number' onChange={handleChange} value={formData?.globalChapterDaysBeforeReviewDue}></input>
                    {formErrors.globalChapterDaysBeforeReviewDueErrors ? (<p className='form-field__error-message'>{formErrors.globalChapterDaysBeforeReviewDueErrors}</p>) : null}
                    <p>The range of days used for reporting chapters that need to be reviewed.</p>
                </div>

                <div className="form-field-wrapper centered-fields">
                    <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                </div>
            </Form>
        }
    }

    return (
        !isLoading ?
            <div className="form-container">
                <div className='form-inner-content'>
                    {renderForm()}
                </div>
            </div> : (<EllipsesLoader message="Loading..." />)
    )
}

export default SettingsForm;