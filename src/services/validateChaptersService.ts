import { ChapterStatuses } from "@/constants/constants";
import { Chapter, ValidationModel } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";
import { UTCDate } from "@date-fns/utc";
import { isAfter, isBefore } from "date-fns";

export const validateChapter = (chapter: Chapter): ValidationModel => {
    const result: ValidationModel =
    {
        isValid: true,
        message: ""
    }

    if (isStringEmpty(chapter.name)) {
        result.isValid = false;
        result.message += "The 'Name' field is a mandatory field.\n"
    }

    if (chapter.statusId === ChapterStatuses.COMPLETED) {
        if(!chapter.originalDateCompleted || !chapter.lastDateCompleted) {
            result.message += "The 'Original Date Completed' and 'Last Date Completed' must be set.\n";
            result.isValid = false;
            return result;
        }

        if (isAfter(chapter.originalDateCompleted , chapter.lastDateCompleted)) {
            result.message += "The 'Original Date Completed' cannot be after the 'Last Date Completed'.\n"
            result.isValid = false;
        }

        if (isAfter(new Date(chapter.originalDateCompleted) , new UTCDate())) {
            result.message += "The 'Original Date Completed' cannot be set to a day in the future.\n"
            result.isValid = false;
        }

        if (isAfter(new Date(chapter.lastDateCompleted) , new UTCDate())) {
            result.message += "The 'Last Date Completed' cannot be set to a day in the future.\n"
            result.isValid = false;
        }

        if (isBefore(chapter.lastDateCompleted,chapter.originalDateCompleted)) {
            result.message += "The 'Last Date Completed' cannot be before the 'Original Date Completed'.\n"
            result.isValid = false;
        }
    }

    return result;
}
