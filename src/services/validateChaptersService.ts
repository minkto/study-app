import { ChapterStatuses } from "@/constants/constants";
import { Chapter, ChapterValidationModel } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { UTCDate } from "@date-fns/utc";
import { isAfter, isBefore } from "date-fns";

export const validateChapter = (chapter: Chapter): ChapterValidationModel => {
    const result: ChapterValidationModel =
    {
        isValid: true,
        message: "" ,
        formErrors: 
        {
            lastDateCompletedError : "",
            nameError: "",
            originalDateCompletedError: "",
            urlError : ""
        }
    }

    if (isStringEmpty(chapter.name)) {
        result.formErrors.nameError = "The 'Name' field is a mandatory field.\n";
        result.isValid = false;
    }

    if (chapter.statusId === ChapterStatuses.COMPLETED) {
        if(!chapter.originalDateCompleted || !chapter.lastDateCompleted) {
            result.formErrors.originalDateCompletedError = "The 'Original Date Completed' and 'Last Date Completed' must be set.\n";
            result.isValid = false;
            return result;
        }

        const originalDateCompleted = new Date(chapter.originalDateCompleted);
        const lastDateCompleted = new Date(chapter.lastDateCompleted);
        const now = new UTCDate();

        if (isAfter(originalDateCompleted , lastDateCompleted)) {
            result.formErrors.originalDateCompletedError = "The 'Original Date Completed' cannot be after the 'Last Date Completed'.\n"
            result.isValid = false;
        }

        if (isAfter(originalDateCompleted , now)) {
            result.formErrors.originalDateCompletedError = "The 'Original Date Completed' cannot be set to a day in the future.\n"
            result.isValid = false;
        }

        if (isAfter(lastDateCompleted , now)) {
            result.formErrors.lastDateCompletedError = "The 'Last Date Completed' cannot be set to a day in the future.\n"
            result.isValid = false;
        }

        if (isBefore(lastDateCompleted,originalDateCompleted)) {
            result.formErrors.lastDateCompletedError = "The 'Last Date Completed' cannot be before the 'Original Date Completed'.\n"
            result.isValid = false;
        }
    }

    for (const errorKey in result.formErrors) {
        const message = result.formErrors[errorKey as keyof typeof result.formErrors];
        if (message) {
          result.message += message;
        }
      }
    
    return result;
}
