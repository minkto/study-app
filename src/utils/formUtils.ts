import { FormState } from "@/constants/constants";
import { Dispatch, SetStateAction, ChangeEvent } from "react";

export const handleFormChange = <TFormDataState extends object>(
    setFormDataCallback: Dispatch<SetStateAction<TFormDataState>>,
    event: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
) => {
    const target = event.target;

    if (target.type === "checkbox" && target instanceof HTMLInputElement) {
        setFormDataCallback((prev: TFormDataState) => ({ ...prev, [target.name]: target.checked }));
    } else {
        setFormDataCallback((prev: TFormDataState) => ({ ...prev, [target.name]: target.value }));
    }
};

export const getFormMethod = (formState: number) => {
    switch (formState) {
        case FormState.ADD:
            return "POST";
        case FormState.EDIT:
            return "PUT";
        case FormState.VIEW:
            return "GET";
        case FormState.DELETE:
            return "DELETE";
        default:
            return "";
    }
}