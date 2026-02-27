import categoryWithUserExists from "@/db/categories/categoryWithUserExists";
import { Category, CategoryValidationModel } from "@/shared.types";
import { isStringEmpty } from "@/utils/stringUtils";

export const validateCategoriesService = async (category: Category): Promise<CategoryValidationModel> => {
    const errors: CategoryValidationModel =
    {
        message: '',
        isValid: true,
        errors:
        {
            categoryNameErrors: '',
            duplicateError: ''
        }
    }

    if (isStringEmpty(category.name)) {
        errors.errors.categoryNameErrors += 'Name cannot be empty.';
        errors.isValid = false;
    }

    const categoryExist = await categoryWithUserExists(category);

    if (categoryExist) {
        errors.errors.categoryNameErrors += 'A Category already exists with the same name.';
        errors.isValid = false;
    }

    for (const errorKey in errors.errors) {
        const message = errors.errors[errorKey as keyof typeof errors.errors];
        if (message) {
            errors.message += message;
        }
    }

    return errors;
}

export default validateCategoriesService;