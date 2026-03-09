export function isStringEmpty(value: string | null | undefined ) {
    return (value == null || value === undefined || (typeof value === "string" && value.trim().length === 0));
}

export function removeWhitespace(value: string | null | undefined ) {

    if(isStringEmpty(value))
    {
        return null;
    }

    return value?.trim()?.replaceAll(/  +/g, ' ') ?? '';
}