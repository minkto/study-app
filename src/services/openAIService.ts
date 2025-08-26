import { ChatAIErrorMessages } from "@/constants/constants";
import { isStringEmpty } from "@/utils/stringUtils";
import OpenAI from "openai";
import { zodToJsonSchema } from "openai/_vendor/zod-to-json-schema/zodToJsonSchema.mjs";
import z from "zod";

export async function getResourceFromOpenAI(prompt: string) {
    try {
        const client = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY,
        });

        let resources = {};

        // TODO: Define the schema for the request body.
        const ResourceObject = z.object({
            name: z.string(),
            chapters: z.array(z.string()),
            source: z.string(),
        });

        const ResourceListObject = z.object({
            resources: ResourceObject.array(),
        })

        const resourceSchema = zodToJsonSchema(ResourceListObject);

        const response = await client.responses.create({
            model: 'gpt-4o-mini',
            input: [
                {
                    role: "system",
                    content:
                        `Create five Resource objects and add all chapters and their sub chapters.
    Format citation source into a valid URL string.
    Only get resource if the source does not have a 404 status code.
    Format the JSON to make it valid matching the schema structure exactly.
    Remove new lines in chapter name property.
    Escape all double quotes in the JSON.
    If you do not understand the prompt, return an empty JSON object { "resources": [] }.`
                },
                { role: "user", content: `Find resources to learn ${prompt}. Include the name of the resource. Drill down on all the topics as chapters.` },

            ],
            text: {
                format: {
                    type: "json_schema",
                    name: "resource_list_object",
                    schema: resourceSchema
                },
            },
            tools: [{ type: "web_search_preview" }],
        })


        try {
            resources = JSON.parse(response.output_text);
            return resources;
        } catch (err) {
            console.error("Raw output was not valid JSON:", err);
        }

        return { resources: [] }; // Return an empty array if parsing fails
    }

    // TODO: Handle specific errors from OpenAI service.
    catch (error) {
        console.error("API error:", error);
        return new Response("Internal Server Error", { status: 500 });
    }
}

export function validateOpenAIPromptValue(prompt: string)
{
    if (isStringEmpty(prompt)) {
        return { success: false, error: ChatAIErrorMessages.EMPTY_PROMPT };
    }

    if (prompt.length > 1000)
    {
        return { success: false, error: ChatAIErrorMessages.PROMPT_TOO_LONG };
    }

    // TODO: Add more validation rules about the CREDITS that may belong to the user.
    
    return { success: true, error: null };
}