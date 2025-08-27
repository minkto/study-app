export class ExternalApiError extends Error {

    statusCode?: number | string 

    constructor(message: string, statusCode: number | string = 500) {

        super(message);
        this.message = message;
        this.statusCode = statusCode;
    }
}


export const createApiErrorResponse = (
    error: unknown | Error | ExternalApiError,
    statusCode = 500,
    message?: string) => {

    console.log("An API error has occured: ", error);

    if (error instanceof ExternalApiError) {
        return {
            errorMessage: message ?? "An error has occured within our services.",
            status: statusCode ?? error.statusCode
        }
    }

    if (error instanceof Error) {
        return {
            errorMessage: message ?? error.message,
            status: statusCode
        }
    }

    return {
        errorMessage: message ?? "An error has occured in the application.",
        status: statusCode
    }
}