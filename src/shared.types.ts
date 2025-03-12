export interface Resource {
    resourceId?: number,
    name: string,
    description?: string,
    categoryId?: number
}

export interface Chapter {
    chapterId?: number,
    resourceId?: number,
    statusId?: number,
    name: string,
    url?: string,
    originalDateCompleted?: string  | null,
    lastDateCompleted?: string  | null,
    daysSinceCompleted?: number
}

export interface Category {
    categoryId?: number | undefined | null,
    name: string
}

export interface Status 
{
    statusId?: number | undefined | null,
    name: string
}

export interface SvgIcon 
{
    width?: number,
    height?: number
}