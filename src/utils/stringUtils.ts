export function isStringEmpty(value: string | null | undefined ) {
    return (value == null || value === undefined || (typeof value === "string" && value.trim().length === 0));
}