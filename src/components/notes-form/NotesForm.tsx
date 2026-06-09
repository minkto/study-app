import { NOTE_MAX_CONTENT } from "@/constants/constants";
import { Note } from "@/shared.types";
import { handleFormChange } from "@/utils/formUtils";
import Form from "next/form";
import { FormEvent, useCallback, useState } from "react";
import { toast } from "sonner";

interface NotesFormProps {
    state?: number;
    noteId?: number;
    chapterId?: number;
    onFormSubmit?: () => void;
}

const TOP_LEVEL_ERROR_MESSAGE = "An error has occured when submitting the form.";

export const NotesForm = ({ state, noteId, chapterId, onFormSubmit }: NotesFormProps) => {

    const [formDisabled, setFormDisabled] = useState(false);
    const [formErrors, setFormErrors] = useState(
        {
            contentErrors: ''
        });

    const [formData, setFormData] = useState<Note>({
        content: "",
        chapterId: -1,
    });

    const charsRemaining = NOTE_MAX_CONTENT - formData.content.length;

    const onSubmit = async (event: FormEvent<HTMLFormElement>) => {

        try {
            setFormDisabled(true);
            event.preventDefault();

            if (!isFormValid()) {
                return;
            }

            const response = await fetch(`/api/chapters/${chapterId}/notes/`, {
                method: "POST",
                body: JSON.stringify(formData)
            })

            if (!response.ok) {
                const responseMessage = await response.json();
                toast.error('Error', { closeButton: true, description: responseMessage?.message ?? TOP_LEVEL_ERROR_MESSAGE });
                return;
            }

            toast.success('Success', { closeButton: true, description: 'Note was saved successfully.' })
            if (onFormSubmit !== undefined) {
                onFormSubmit();
            }

            setFormData(prev => ({ ...prev, content: "" }));

        } catch (error) {
            if (error instanceof Error) {
                toast.error('Error', { closeButton: true, description: TOP_LEVEL_ERROR_MESSAGE })
                console.error(error);
            }
        } finally {
            setFormDisabled(false);
        }
    }

    const isFormValid = useCallback((): boolean => {

        const errors = { contentErrors: "" };
        if (formData.content.length <= 0) {
            errors.contentErrors = `Cannot save note if content is empty.`;
        }

        if (formData.content.length > NOTE_MAX_CONTENT) {
            errors.contentErrors = `Content must have a character length less than ${NOTE_MAX_CONTENT}.`;
        }

        setFormErrors(errors);
        return !errors.contentErrors;
    }, [formData.content.length])

    const handleContentChange = useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
        handleFormChange(setFormData,e);
    }, []);


    return (<div className={`form-container plain`}>
        <div className='form-inner-content'>
            <Form className='form-dashboard' action="/" onSubmit={onSubmit}>
                <div className="form-field-wrapper centered-fields">
                    <textarea disabled={formDisabled} className="form-field" id="form-note__content" rows={5} maxLength={NOTE_MAX_CONTENT}
                        name="content" onChange={handleContentChange}

                        value={formData?.content ?? ""} />
                    {formErrors.contentErrors ? (<p className='form-field__error-message'>{formErrors.contentErrors}</p>) : null}
                </div>

                <div>{charsRemaining} : Characters Remaining</div>
                <div className="form-field-wrapper centered-fields">
                    <button disabled={formDisabled} className={"form-field"} type='submit'>Save</button>
                </div>
            </Form>
        </div>
    </div>)

}

export default NotesForm;