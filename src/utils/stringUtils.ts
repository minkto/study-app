export function isStringEmpty(value: string | null ) {
    return (value == null || (typeof value === "string" && value.trim().length === 0));
}