'use client'

import { UserSettings } from "@/shared.types";
import Form from "next/form";
import { useEffect, useState } from "react";

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

    const formErrors =
    {
        aiHelperCreditsError: '',
        globalChapterDaysBeforeReviewDueError: ''
    };

    const handleChange = () => {
        // TODO: When updating the Global Days Before Review Due.
    };



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
                    <Form className='form-dashboard' onSubmit={() => { console.log('Submit') }} action={`/dashboard/settings`}>
                        <div className="form-field-wrapper centered-fields">
                            <label htmlFor='form-settings__ai-helper-credits'>AI Helper Credits</label>
                            <input disabled className="form-field" id="form-settings__ai-helper-credits" name="ai-helper-credits" type='text' onChange={handleChange} value={formData?.aiHelperCredits ?? 0}></input>
                            {formErrors.aiHelperCreditsError ? (<p className='form-field__error-message'>{formErrors.aiHelperCreditsError}</p>) : null}
                            <p>This will be where general settings are changed.</p>
                        </div>
                    </Form>
                </div>
            </div> : null)
}

export default SettingsForm;