export const ChatAIErrorMessages = 
{
    EMPTY_PROMPT: "Prompt cannot be empty.",
    PROMPT_TOO_LONG: "Prompt exceeds the maximum 1000 characters.",
    API_ERROR: "An error occurred while processing your request. Please try again later."
}


export const FormState =
{
    ADD: 0,
    EDIT: 1
};

export const ChapterStatuses =
{
    NOT_STARTED: 0,
    IN_PROGRESS: 1,
    COMPLETED: 2,
    INVALID: 3
};

export const ListingPageSizes =
{
    DEFAULT: "5",
    CHAPTERS: "5",
    RESOURCES: "2"
};

export const FilterByQueryKeys =
{
    ChapterListings:
    {
        STATUS: "status",
        DAYS_SINCE_LAST_COMPLETED: "daysSinceLastCompleted"
    },
    ResourceListings:
    {
        CATEGORY: "Category",
    }
};