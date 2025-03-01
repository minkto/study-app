export interface Resource
{
    resourceId? : number,
    name: string,
    description? : string,
    categoryId?: number
}

export interface Chapter
{
    chapterId? : number,
    resourceId? : number,
    statusId? : number,
    name: string,
    url?: string,
    originalDateCompleted?: Date,
    lastDateCompleted?: Date
}