export interface GetResourceDto {
    resourceId?: number,
    name: string,
    description?: string,
    categoryId?: number| null | undefined,
    categoryName? : string,
    percentageCompleted? : number;
}

export interface GetResourcesDto {
    resources?: GetResourceDto[];
    pageCount?: number;
}

export interface Resource {
    resourceId?: number,
    userId?: string | null;
    name: string,
    description?: string,
    categoryId?: number| null | undefined,
    categoryName? : string
    chapters?: Chapter[]| null| undefined,
    isPinned: boolean;
}

export interface CreateBulkResourceDto
{
    userId?: string | null;
    resources?: Resource[];
}


export interface User
{
    userId: number;
    clerkUserId: string;
} 

export interface AppUser {
    userId: number;
    clerkUserId?: string;
}


export interface UserSettings
{
    userSettingId?: number;
    userId?: number;
    aiHelperCredits?: number;
    globalChapterDaysBeforeReviewDue?: number;
} 

export interface UserSettingsValidationModel
{
    isValid : boolean;
    message : string;
    formErrors : UserSettingsFormErrors
}

export interface UserSettingsFormErrors
{
    userIdErrors: string;
    globalChapterDaysBeforeReviewDueErrors: string;
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
    width?: number;
    height?: number;
    className? : string;
    useCurrentColor? : boolean;
    removeStroke? : boolean;
}

export interface ListingSearchQuery
{
    sortBy? : string,
    sortOrder? : string,
    searchTerm?: string,
    page?:string
    filters? : ListingSearchQueryFilters;
    userId? : string | null;
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


export interface AIChatMessage
{
    requestMessage?: string;
    responseMessage?: string;
    responseObject?: AIChatApiResponse;
    showConfirmationOptions?: boolean;
} 

export interface AIChatMessages
{
    messages: AIChatMessage[];
} 

export interface AIChatApiResponse
{
    resources?: AIChatResourceModel[];
    errorMessage?: string;
}

export interface AIChatResourceModel
{
    name?: string;
    chapters?: string[];
    source?: string;
}

export interface ChaptersSummary 
{
    chaptersCompletedToday : number;
    chaptersCompletedCurrentMonth : number;
    chaptersCompletedCurrentMonthByCategory : ProgressItem[];
    chaptersInProgress : number;
    latestResourcesProgress : ProgressItem[];
    chaptersWithLongestReviewDates : ListItem[];
    pinnedResources : ListItem[];
}

export interface ProgressItem {
    name: string;
    numberValue : number;
}

export interface ListItem {
    title: string;
    subTitle?: string;
    value? : string;
}