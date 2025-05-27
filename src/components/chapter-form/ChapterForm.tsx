import { ChapterStatuses, FormState } from "@/constants/constants";
import { Chapter, ChapterFormErrors, Status } from "@/shared.types";
import Form from "next/form";
import { useRouter } from "next/navigation";
import { ChangeEvent, FormEvent, ReactElement, useEffect, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { startOfDay } from 'date-fns';
import { UTCDate } from "@date-fns/utc";
import { validateChapter } from "@/services/validateChaptersService";

interface ChapterFormProps {
    resourceId: string;
    chapterId?: string;
    formState: number;
}

const ChapterForm = ({ resourceId, chapterId, formState }: ChapterFormProps) => {

    const [formErrors, setFormErrors] = useState<ChapterFormErrors>({
        nameError: "",
        urlError: "",
        originalDateCompletedError: "",
        lastDateCompletedError: ""
    });

    const [formData, setFormData] = useState<Chapter>({
        name: "",
        url: "",
        lastDateCompleted: startOfDay(new UTCDate()),
        originalDateCompleted: startOfDay(new UTCDate()),
        statusId: -1,
        resourceId: -1,
        chapterId: -1
    });

    const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);
    const [statuses, setStatuses] = useState<Status[]>([]);
    const [originalDateCompleted, setOriginalDateCompleted] = useState<Date | null | undefined>(startOfDay(new UTCDate()));
    const [lastDateCompleted, setLastDateCompleted] = useState<Date | null | undefined>(startOfDay(new UTCDate()));

    const router = useRouter();

    const handleChange = (event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        setFormData({ ...formData, [event.target.name]: event.target.value });
    }

    const isFormValid = (): boolean => {
        const validationModel = validateChapter(formData);

        if(!validationModel.isValid)
        {
            setFormErrors(validationModel?.formErrors);
        }

        return validationModel.isValid;
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

    const setFormDataDateValues = () => {
        const statusValue = Number(formData?.statusId);

        if (statusValue === ChapterStatuses.COMPLETED) {
            formData.originalDateCompleted = originalDateCompleted ? new UTCDate(originalDateCompleted) : null;
            formData.lastDateCompleted = lastDateCompleted ? new UTCDate(lastDateCompleted) : null;
        }
        else {
            formData.originalDateCompleted = null;
            formData.lastDateCompleted = null;
        }
    }

    const renderDateFields = (): ReactElement => {

        const statusValue = Number(formData?.statusId);

        if (statusValue === ChapterStatuses.COMPLETED) {
            return <>
                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-chapter__original-date'>Original Date Completed</label>
                    <DatePicker
                        id="form-chapter__original-date"
                        name="originalDateCompleted"
                        className="form-field"
                        selected={originalDateCompleted}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            if (date) {
                                setOriginalDateCompleted(startOfDay(date));
                            }
                        }} />

                    {formErrors.originalDateCompletedError ? (<p className='form-field__error-message'>{formErrors.originalDateCompletedError}</p>) : null}
                </div>

                <div className="form-field-wrapper centered-fields">
                    <label htmlFor='form-chapter__last-date-completed'>Last Date Completed</label>
                    <DatePicker
                        id="form-chapter__last-date-completed"
                        name="lastDateCompleted"
                        className="form-field"
                        selected={lastDateCompleted}
                        dateFormat="dd/MM/yyyy"
                        onChange={(date) => {
                            if (date) {
                                setLastDateCompleted(startOfDay(date));
                            }
                        }} />

                    {formErrors.lastDateCompletedError ? (<p className='form-field__error-message'>{formErrors.lastDateCompletedError}</p>) : null}
                </div>
            </>
        }
        else {
            return <></>;
        }
    }

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        setFormDataDefaultValues();
        setFormDataDateValues();

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
                setLastDateCompleted(data?.lastDateCompleted);
                setOriginalDateCompleted(data?.originalDateCompleted);

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
                    {renderDateFields()}
                    <div className="form-field-wrapper centered-fields">
                        <button disabled={buttonDisabled} className={"form-field"} type='submit'>Save</button>
                    </div>
                </Form>
            </div>
        </div>)
}

export default ChapterForm;