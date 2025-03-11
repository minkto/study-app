import { FormState } from "@/constants/constants";
import { Chapter, Status } from "@/shared.types";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";

interface ChapterFormProps {
    resourceId: string;
    chapterId?: string;
    formState: number;
}

const ChapterForm = ({ resourceId, chapterId, formState }: ChapterFormProps) => {

    const [formErrors, setFormErrors] = useState({
        nameError: "",
        urlError: "",
        originalDateCompletedError: "",
        lastDateCompletedError: ""
    });

    const [formData, setFormData] = useState<Chapter>({
        name: "",
        url: "",
        lastDateCompleted: "",
        originalDateCompleted: "",
        statusId: -1,
        resourceId: -1,
        chapterId: -1
    });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const router = useRouter();


    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
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

    const setFormDataDefaultValues = () => {
        // If nothing was changed on dropdown, take the first value.
        if ((statuses?.length > 0 && formData.statusId !== undefined && formData.statusId <= -1)
            &&
            (statuses[0]?.statusId !== undefined && statuses[0]?.statusId !== null)) {
            formData.statusId = statuses[0]?.statusId;
        }

        formData.resourceId = parseInt(resourceId); 
    }

    const renderDateFields = (): ReactElement => {
        return <>
            <div className="form-field-wrapper centered-fields">
                <label htmlFor='form-chapter__original-date'>Original Date Completed</label>
                <input className="form-field" id="form-chapter__original-date" name="originalDateCompleted" type='text' onChange={handleChange} value={formData?.originalDateCompleted ?? ""}></input>
                {formErrors.originalDateCompletedError ? (<p className='form-field__error-message'>{formErrors.originalDateCompletedError}</p>) : null}
            </div>

            <div className="form-field-wrapper centered-fields">
                <label htmlFor='form-chapter__last-date-completed'>Last Date Completed</label>
                <input className="form-field" id="form-chapter__last-date-completed" name="lastDateCompleted" type='text' onChange={handleChange} value={formData?.lastDateCompleted ?? ""}></input>
                {formErrors.lastDateCompletedError ? (<p className='form-field__error-message'>{formErrors.lastDateCompletedError}</p>) : null}
            </div>
        </>
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFormDataDefaultValues();

        if (!isFormValid()) {
            return;
        }

        try {
            setButtonDisabled(true);
            const apiUrl = formState === FormState.ADD ? '/api/chapters' : `/api/chapters/${chapterId}` 
            const response = await fetch(apiUrl, {
                method: formState === FormState.ADD ? 'POST' : 'PUT',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Failed to submit the data. Please try again.')
            }

            router.push(`/dashboard/resources/${resourceId}/chapters`);

        } catch (error) {
            if (error instanceof Error) {
                console.error(error);
            }
        }
        finally {
            setButtonDisabled(false);
        }
    }

    useEffect(() => {
        const getStatuses = async () => {
            try {
                const response = await fetch('/api/statuses');
                const data: Status[] = await response.json();
                setStatuses(data);

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        }

        const loadChapterDetails = async () => {
            try {
                const response = await fetch(`/api/chapters/${chapterId}`);
                const data: Chapter = await response.json();
                setFormData(data);

            } catch (error) {
                if (error instanceof Error) {
                    console.error(error);
                }
            }
        }

        switch (formState) {
            case FormState.ADD:
                getStatuses();
                break;
            case FormState.EDIT:
                getStatuses();
                loadChapterDetails();
                break;
        }
    }, [formState, chapterId]);

    return (
        <div className="form-container">
            <div className="form-header">
                <h1 className='form-header__title'>{formState === FormState.ADD ? "Add" : "Edit"} Chapter</h1>
            </div>
            <div className='form-inner-content'>
                <Form className='form-dashboard' onSubmit={onSubmit} action={`/dashboard/resources/${resourceId}/chapters`}>
                    <div className="form-field-wrapper centered-fields">
                        <label htmlFor='form-chapter__name'>Name</label>
                        <input className="form-field" id="form-chapter__name" name="name" type='text' onChange={handleChange} value={formData?.name}></input>
                        {formErrors.nameError ? (<p className='form-field__error-message'>{formErrors.nameError}</p>) : null}
                    </div>

                    <div className="form-field-wrapper centered-fields">
                        <label htmlFor='form-chapter__url'>URL</label>
                        <input className="form-field" id="form-chapter__url" name="url" type='text' onChange={handleChange} value={formData?.url}></input>
                        {formErrors.urlError ? (<p className='form-field__error-message'>{formErrors.urlError}</p>) : null}
                    </div>

                    <div className="form-field-wrapper centered-fields">
                        <label htmlFor='form-resource__status'>Status</label>
                        <select className="form-field" id='form-resource__status' name="statusId" onChange={handleChange}
                            value={formData?.statusId ?? -1}>
                            {
                                statuses?.map((c: Status) =>
                                    (<option key={c.statusId} value={c.statusId ?? -1}>{c.name}</option>)
                                )}
                        </select>
                    </div>
                    {formState === FormState.EDIT ? renderDateFields() : null}
                    <div className="form-field-wrapper centered-fields">
                        <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                    </div>
                </Form>
            </div>
        </div>)
}

export default ChapterForm;