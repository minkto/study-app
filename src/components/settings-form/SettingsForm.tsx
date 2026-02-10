'use client'

import { UserSettings } from "@/shared.types";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, useEffect, useState } from "react";

interface SettingsFormProps {
    userId?: string;
}

const SettingsForm = ({ userId }: SettingsFormProps) => {

    const [formData, setFormData] = useState<UserSettings>(
        {
            aiHelperCredits: 0,
            userId: -1,
            globalChapterDaysBeforeReviewDue: 30,
            userSettingId: - 1
        });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

    const formErrors =
    {
        aiHelperCreditsError: '',
        globalChapterDaysBeforeReviewDueError: ''
    };

    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (event.target.type === "checkbox" && event.target instanceof HTMLInputElement) {
            setFormData({ ...formData, [event.target.name]: event.target.checked });
        }
        else {
            setFormData({ ...formData, [event.target.name]: event.target.value });
        }
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        try {
            setButtonDisabled(true);
            const response = await fetch(`/api/users/${userId}/settings`, {
                method: 'PUT',
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }

            router.refresh();

        }
        catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
    }

    useEffect(() => {
        const getUserDetails = async () => {

            const response = await fetch(`/api/users/${userId}/settings`);
            const data = await response.json();
            
            setFormData(data);

            return data;
        }
        
        getUserDetails();

    }, [userId])

    return (
        userId ?
            <div className="form-container">
                <div className='form-inner-content'>
                    <Form className='form-dashboard' onSubmit={onSubmit} action={`/dashboard/settings`}>
                        <div className="form-field-wrapper centered-fields">
                            <label htmlFor='form-settings__ai-helper-credits'>AI Helper Credits</label>
                            <input disabled className="form-field" id="form-settings__ai-helper-credits" name="ai-helper-credits" type='text' onChange={handleChange} value={formData?.aiHelperCredits ?? 0}></input>
                            {formErrors.aiHelperCreditsError ? (<p className='form-field__error-message'>{formErrors.aiHelperCreditsError}</p>) : null}
                            <p>This amount of current credit available to be used.</p>
                        </div>

                        <div className="form-field-wrapper centered-fields">
                            <label htmlFor='form-settings__global_chapter_days_before_review_due'>Global chapter days before review due</label>
                            <input className="form-field" id="form-settings__global_chapter_days_before_review_due" name="globalChapterDaysBeforeReviewDue" type='number' onChange={handleChange} value={formData?.globalChapterDaysBeforeReviewDue}></input>
                            {formErrors.aiHelperCreditsError ? (<p className='form-field__error-message'>{formErrors.aiHelperCreditsError}</p>) : null}
                            <p>The range of days used for reporting chapters that need to be reviewed.</p>
                        </div>

                        <div className="form-field-wrapper centered-fields">
                            <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                            <p>Changes have been successfully saved</p>
                        </div>
                    </Form>
                </div>
            </div> : null)
}

export default SettingsForm;