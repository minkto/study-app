import { UserSettings, UserSettingsValidationModel } from "@/shared.types";

export const validateUserSettings = (settings: UserSettings): UserSettingsValidationModel => {
    const result: UserSettingsValidationModel =
    {
        message: '',
        isValid: true,
        formErrors:
        {
            userIdErrors: '',
            globalChapterDaysBeforeReviewDueErrors: ''
        }
    };

    if (!settings.userUid) {
        result.formErrors.userIdErrors = 'User ID is not valid.';
        result.isValid = false;
    }

    if (!settings.globalChapterDaysBeforeReviewDue ||
        settings.globalChapterDaysBeforeReviewDue <= 0) {
        result.formErrors.globalChapterDaysBeforeReviewDueErrors = 'Global chapter Days before date due must be greater than 0.';
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

export default validateUserSettings;