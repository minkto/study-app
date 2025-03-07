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
    originalDateCompleted?: string | undefined | null,
    lastDateCompleted?: string | undefined | null,
    daysSinceCompleted?: number
}

export interface Category {
    categoryId?: number | undefined | null,
    name: string
}