import { ChangeEvent } from "react";

export const handleFormChange = <TFormDataState extends object>(setFormDataCallback: (a: TFormDataState) => void,
    formData: TFormDataState) => (
        event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    ) => {
        if (event.target.type === "checkbox" && event.target instanceof HTMLInputElement) {
            setFormDataCallback({ ...formData, [event.target.name]: event.target.checked });
        } else {
            setFormDataCallback({ ...formData, [event.target.name]: event.target.value });
        }
    };