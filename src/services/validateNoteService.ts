import { NOTE_MAX_CONTENT } from "@/constants/constants";
import { Note, NoteValidationModel } from "@/shared.types";

const validateNote = (note: Note): NoteValidationModel => {
    const result: NoteValidationModel =
    {
        message: '',
        isValid: true,
        formErrors:
        {
            contentErrors: ''
        }
    };

    if (note.content?.length > NOTE_MAX_CONTENT) {
        result.formErrors.contentErrors = `Content must have a character length less than ${NOTE_MAX_CONTENT}.`;
        result.isValid = false;
    }

    for (const errorKey in result.formErrors) {
        const message = result.formErrors[errorKey as keyof typeof result.formErrors];
        if (message) {
            result.message += message;
        }
    }

    return result;
}

export default validateNote;