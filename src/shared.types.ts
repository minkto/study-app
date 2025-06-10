export interface GetResourceDto {
    resourceId?: number,
    name: string,
    description?: string,
    categoryId?: number,
    categoryName? : string,
    percentageCompleted? : number
}

export interface Resource {
    resourceId?: number,
    name: string,
    description?: string,
    categoryId?: number,
    categoryName? : string
}

export interface Chapter {
    chapterId?: number,
    resourceId?: number,
    statusId?: number,
    name: string,
    url?: string,
    originalDateCompleted?: Date  | null| undefined,
    lastDateCompleted?: Date  | null| undefined,
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
    height?: number,
    className? : string
}

export interface ListingSearchQuery
{
    sortBy? : string,
    sortOrder? : string,
    searchTerm?: string,
    page?:string
    filters? : ListingSearchQueryFilters;
}

export interface ListingSearchQueryFilters
{
    status? : string[];
    daysSinceLastCompleted? : string[];
    category? : string[];
}

export interface ChapterValidationModel
{
    isValid : boolean;
    message : string;
    formErrors : ChapterFormErrors
}

export interface ChapterFormErrors 
{
    nameError: string;
    urlError: string;
    originalDateCompletedError: string;
    lastDateCompletedError: string; 
}